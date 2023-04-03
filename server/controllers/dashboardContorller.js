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