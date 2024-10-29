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
   // try {
       
      
        console.log(req)

        // await newEvent.save(); 
        
    //     return res.redirect('/event'); 
    // } catch (err) {
    //     console.error(err);
       
    //     return res.redirect('/event/addevent');
    // }
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
