/**
 * GET/
 * Homepage
 */

exports.homepage = async (req, res) => {
    const locals = {
        title: 'Node.js Notes',
        description: 'Free Nodejs Notes App'
    }
    res.render('index', { locals });
}

/**
 * GET/
 * About
 */

exports.about = async (req, res) => {
    const locals = {
        title: 'About - Node.js Notes',
        description: 'Free Nodejs Notes App'
    }
    res.render('about', { locals });
}