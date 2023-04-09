const Note = require('../models/Notes')
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');



/**
 * GET/
 * Dashboard
 */

exports.dashboard = async (req, res) => {

    // const notes = await Note.find({ user: new ObjectId(req.user.id) })
    // console.log(notes)

    // try {
    //     await Note.insertMany([
    //         {
    //             user: "642b0723aece9b3b1e161bfd",
    //             title: 'Daily tips',
    //             body: 'First thing is to make consistency',
    //             createdAt: "2023-04-02T18:48:25.303+00:00",
    //             updatedAt: '2023-04-02T18:48:25.303+00:00'
    //         },{
    //             user: "642b0723aece9b3b1e161bfd",
    //             title: 'millioner throught',
    //             body: 'hard work is better than smart work',
    //             createdAt: "2023-04-02T18:48:25.303+00:00",
    //             updatedAt: '2023-04-02T18:48:25.303+00:00'
    //         },

    //     ])
    // } catch (error) {
    //     console.log(error);
    // }

    let perPage = 12
    let page = req.query.page || 1

    const locals = {
        title: 'Dashboard',
        description: 'Free Nodejs Notes App'
    }

    try {

        await Note.aggregate([
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $match: { user: new mongoose.Types.ObjectId(req.user.id) },
            },
            {
                $project: {
                    title: { $substr: ['$title', 0, 30] },
                    body: { $substr: ['$body', 0, 100] },
                }
            }
        ])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec().then((notes) => {
                Note.count().exec().then((count) => {
                    // console.log(notes);
                    res.render('dashboard/index',
                        {
                            userName: req.user.firstName,
                            locals,
                            notes,
                            layout: '../views/layouts/dashboard',
                            current: page,
                            pages: Math.ceil(count / perPage)
                        });

                })
            })
    } catch (error) {
        console.log(error)
    }
}

/**
 * GET 
 * View Specific Note
 */

exports.dashboardViewNote = async (req, res) => {
    const note = await Note.findById({ _id: req.params.id }).where({ user: req.user.id }).lean()
    if (note) {
        res.render('dashboard/view-notes', {
            noteId: req.params.id,
            note,
            layout: '../views/layouts/dashboard'
        })
    } else {
        res.send('Something went wrong')
    }
}

/**
 * Put 
 * Update Specific Note
 */

exports.dashboardUpdateNote = async (req, res) => {
    try {
        await Note.findOneAndUpdate(
            { _id: req.params.id },
            { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
        ).where({ user: req.user.id });
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
    }
}

/**
 * Delete 
 * Delete Specific Note
 */

exports.dashboardDeleteNote = async (req, res) => {
    try {
        await Note.deleteOne({
            _id: req.params.id
        }).where({ user: req.user.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err);
    }
}

/**
 * GET
 * Add Notes
 */
exports.dashboardAddNote = async (req, res) => {
    res.render('dashboard/add', {
        layout: '../views/layouts/dashboard'
    })
}

/**
 * POST
 * Add Notes
 */

exports.dashboardAddNoteSubmit = async (req, res) => {
    try {
        req.body.user = req.user.id
        await Note.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err);
    }
}

/**
 * GET
 * Search
 */

exports.dashboardSearch = async (req, res) => {
    try {
        res.render('dashboard/search', {
            SearchResult: "",
            layout: '../views/layouts/dashboard'
        })
    } catch (err) {
        console.log(err);
    }
}

/**
 * POST
 * Search
 */

exports.dashboardSearchSubmit = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, '')
        const searchResults = await Note.find ({
            $or: [
              { title: { $regex: searchNoSpecialChars, $options: "i" } },
              { body: { $regex: searchNoSpecialChars, $options: "i" } }
            ]
          }).where({ user: req.user.id })
        //   console.log(searchResults);        
        res.render('dashboard/search', {
            searchResults,
            layout: '../views/layouts/dashboard'
        })
    } catch (err) {
        console.log(err);
    }
}