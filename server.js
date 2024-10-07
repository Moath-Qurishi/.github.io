const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// إعداد Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'YOUR_EMAIL@gmail.com', // استبدل بـ بريدك الإلكتروني
        pass: 'YOUR_APP_PASSWORD'     // استبدل بـ "كلمة مرور التطبيق"
    }
});

// تمكين استقبال الملفات وبيانات النموذج
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// استلام الملفات المرفوعة من النموذج
app.post('/submit', upload.array('files', 15), (req, res) => {
    const name = req.body.name;
    const courseCode = req.body.courseCode;
    const files = req.files;

    // إعداد محتوى الإيميل
    let mailOptions = {
        from: 'YOUR_EMAIL@gmail.com',
        to: 'moad.qurishi@gmail.com',
        subject: `Files submission from ${name} - Course Code: ${courseCode}`,
        text: `Name: ${name}\nCourse Code: ${courseCode}`,
        attachments: files.map(file => ({
            filename: file.originalname,
            path: file.path
        }))
    };

    // إرسال الإيميل
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error while sending email: ' + error);
        }

        // حذف الملفات المرفوعة من السيرفر بعد الإرسال
        files.forEach(file => fs.unlinkSync(file.path));
        
        res.send('Files submitted successfully and email sent!');
    });
});

// تشغيل الخادم على بورت 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
