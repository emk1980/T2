const express = require('express');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');

const app = express();
const port = process.env.PORT || 3000;

// تنظیمات فایل اکسل
const excelFilePath = path.join(__dirname, 'a.xlsx');

// Middleware برای مدیریت فایل‌های استاتیک
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// افزودن مختصات به فایل اکسل
app.post('/add-location', (req, res) => {
    const { latitude, longitude } = req.body;

    try {
        // خواندن فایل اکسل
        const workbook = xlsx.readFile(excelFilePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // پیدا کردن ردیف بعدی برای نوشتن
        const range = xlsx.utils.decode_range(sheet['!ref']);
        const nextRow = range.e.r + 1;

        // نوشتن داده‌های جدید در فایل اکسل
        sheet[`A${nextRow}`] = { t: 'n', v: latitude };
        sheet[`B${nextRow}`] = { t: 'n', v: longitude };
        range.e.r = nextRow;
        sheet['!ref'] = xlsx.utils.encode_range(range);

        // ذخیره‌سازی تغییرات در فایل اکسل
        xlsx.writeFile(workbook, excelFilePath);

        res.send({ success: true });
    } catch (error) {
        console.error('Error writing to Excel file:', error);
        res.status(500).send('Server Error');
    }
});

// راه‌اندازی سرور
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
