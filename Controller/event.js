const Event = require('../models/event.js');


module.exports.eventGet = async (req, res) => {
    try {
        const events = await Event.find({});
       return res.render("event/events.ejs", { events });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error fetching events');
        return res.redirect('/error');
    }
   
}


module.exports.eventAdd = (req, res) => {
    return res.render("event/postEvent.ejs");
}
   


module.exports.eventPost = async (req, res) => {
    try {
        const filesArray = req.files.map(file => ({
            url: file.path,
            filename: file.filename,
        }));

        const newEvent = new Event({
            title: req.body.post.title,
            description: req.body.post.description,
            image: filesArray,
            location: req.body.post.location,
            date: req.body.post.date,
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        res.status(400).json({ message: 'Error creating event', error: error.message });
    }
}


module.exports.eventDelete = async (req, res) => {
    try {
        const { id } = req.params;
        await Event.findByIdAndDelete(id); 
        req.flash('success', 'Event deleted successfully');
        return res.redirect('/event'); 
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error deleting event');
        return res.redirect('/event');
    }
}
