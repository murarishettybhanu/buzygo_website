var nodemailer = require('nodemailer');

module.exports = (req, res) => {
    try {
        let now = new Date();
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'buzygo.sales@gmail.com',
                pass: 'tinrrqjxaezrnpdp'
            }
        });

        var mailOptions = {
            from: 'buzygo.sales@gmail.com',
            to: 'buzygo.sales@gmail.com',
            subject: ` Contact form submitted data`,
            html: `<h1>Date: ${now.toLocaleString()}</h1><br><p>Name:${req.body.name}</p><br><p>Email:<a href="mailto:${req.body.email}">${req.body.email}</a></p><br><p>Phone:${req.body.phone}</p><br><p>Message:${req.body.message}</p>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'buzygo.sales@gmail.com',
                pass: 'tinrrqjxaezrnpdp'
            }
        });

        var mailOptions = {
            from: 'buzygo.sales@gmail.com',
            to: req.body.email,
            subject: `Acknowledgement Subject`,
            text: 'Acknowledgement Content'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        req.flash('success', 'Received your request, will get back to you ASAP 😊');
        res.redirect('/');
    } catch (error) {
        req.flash('fail', 'Failed to submit contact form please try again later.');
        res.redirect('/');
    }
}