let selectedImage = null;
let originalWidth = 0;
let originalHeight = 0;


/* =========================================
   WORKSPACE
========================================= */

function openWorkspace(title, html) {

    const box = document.getElementById("workspace");

    document.getElementById("toolTitle").textContent = title;

    document.getElementById("toolBody").innerHTML = html;

    box.style.display = "block";

    box.scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================================
   IMAGE TOOLS
========================================= */

function imageTool(type) {

    let title = "Image Tool";

    let formats = `
        <option value="image/jpeg">JPG</option>
        <option value="image/png">PNG</option>
        <option value="image/webp">WebP</option>
    `;


    if (type === "resize") {
        title = "🖼️ Image Resizer";
    }

    if (type === "compress") {
        title = "🗜️ Image Compressor";
        formats = `
            <option value="image/jpeg">JPG</option>
            <option value="image/webp">WebP</option>
            <option value="image/png">PNG</option>
        `;
    }

    if (type === "convert") {
        title = "🔄 JPG ↔ PNG";
        formats = `
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
        `;
    }

    if (type === "webp") {
        title = "🌐 JPG/PNG → WebP";
        formats = `
            <option value="image/webp">WebP</option>
        `;
    }


    openWorkspace(
        title,

        `
        <label><b>Select Image</b></label>

        <input
            type="file"
            id="imageFile"
            accept="image/jpeg,image/png,image/webp"
            onchange="loadImage(this)"
        >

        <div id="imagePreview"></div>


        <div class="row">

            <div class="field">

                <label>Width (px)</label>

                <input
                    type="number"
                    id="imgWidth"
                    oninput="changeDimension('width')"
                >

            </div>


            <div class="field">

                <label>Height (px)</label>

                <input
                    type="number"
                    id="imgHeight"
                    oninput="changeDimension('height')"
                >

            </div>

        </div>


        <label>

            <input
                type="checkbox"
                id="ratio"
                checked
            >

            Maintain Aspect Ratio

        </label>


        <br><br>


        <label><b>Output Format</b></label>

        <select id="imgFormat">

            ${formats}

        </select>


        <br><br>


        <label>

            <b>Quality:</b>

            <span id="qualityText">80</span>%

        </label>

        <input
            type="range"
            id="imgQuality"
            min="10"
            max="100"
            value="80"
            oninput="
                document.getElementById('qualityText').textContent=this.value
            "
        >


        <br><br>


        <button onclick="processImage()">
            Process & Download
        </button>


        <div class="result" id="imageResult">
            Select an image first.
        </div>
        `
    );
}


/* =========================================
   LOAD IMAGE
========================================= */

function loadImage(input) {

    const file = input.files[0];

    if (!file) return;


    const reader = new FileReader();


    reader.onload = function(e) {

        selectedImage = new Image();


        selectedImage.onload = function() {

            originalWidth = selectedImage.width;

            originalHeight = selectedImage.height;


            document.getElementById("imgWidth").value =
                originalWidth;

            document.getElementById("imgHeight").value =
                originalHeight;


            document.getElementById("imagePreview").innerHTML = `

                <img
                    src="${e.target.result}"
                    class="preview"
                >

                <p>
                    Original:
                    ${originalWidth} × ${originalHeight}px
                </p>
            `;
        };


        selectedImage.src = e.target.result;
    };


    reader.readAsDataURL(file);
}


/* =========================================
   IMAGE RATIO
========================================= */

function changeDimension(type) {

    if (!document.getElementById("ratio").checked) {
        return;
    }


    if (!originalWidth || !originalHeight) {
        return;
    }


    const width =
        document.getElementById("imgWidth");

    const height =
        document.getElementById("imgHeight");


    if (type === "width") {

        const w = Number(width.value);

        if (!w) return;

        height.value =
            Math.round(
                w * originalHeight / originalWidth
            );
    }


    if (type === "height") {

        const h = Number(height.value);

        if (!h) return;

        width.value =
            Math.round(
                h * originalWidth / originalHeight
            );
    }
}


/* =========================================
   PROCESS IMAGE
========================================= */

function processImage() {

    if (!selectedImage) {

        alert("Please select an image.");

        return;
    }


    const width =
        Number(document.getElementById("imgWidth").value);

    const height =
        Number(document.getElementById("imgHeight").value);


    if (!width || !height) {

        alert("Enter valid width and height.");

        return;
    }


    const format =
        document.getElementById("imgFormat").value;


    const quality =
        Number(document.getElementById("imgQuality").value) / 100;


    const canvas =
        document.createElement("canvas");


    canvas.width = width;

    canvas.height = height;


    const ctx =
        canvas.getContext("2d");


    ctx.drawImage(
        selectedImage,
        0,
        0,
        width,
        height
    );


    canvas.toBlob(

        function(blob) {

            const url =
                URL.createObjectURL(blob);


            let extension = "jpg";


            if (format === "image/png") {
                extension = "png";
            }

            if (format === "image/webp") {
                extension = "webp";
            }


            const a =
                document.createElement("a");


            a.href = url;

            a.download =
                `filetools-${Date.now()}.${extension}`;

            a.textContent =
                "Download Image";


            a.className = "download";


            a.style =
                "display:inline-block;color:white;text-decoration:none;padding:11px 16px;border-radius:8px";


            document.getElementById("imageResult").innerHTML = `

                <b>✅ Image Processed</b>

                <br><br>

                Dimensions:
                ${width} × ${height}px

                <br>

                File Size:
                ${(blob.size / 1024).toFixed(2)} KB

                <br><br>
            `;


            document
                .getElementById("imageResult")
                .appendChild(a);

        },

        format,

        quality
    );
}


/* =========================================
   PDF TOOLS
========================================= */

function pdfTool(type) {


    if (type === "jpgToPdf") {

        openWorkspace(

            "🖼️ JPG → PDF",

            `
            <label><b>Select Images</b></label>

            <input
                type="file"
                id="jpgFiles"
                accept="image/jpeg,image/png,image/webp"
                multiple
            >


            <div class="row">

                <div class="field">

                    <label>Page Width</label>

                    <input
                        type="number"
                        id="pageWidth"
                        value="595"
                    >

                </div>


                <div class="field">

                    <label>Page Height</label>

                    <input
                        type="number"
                        id="pageHeight"
                        value="842"
                    >

                </div>

            </div>


            <label>Orientation</label>

            <select
                id="orientation"
                onchange="pdfOrientation()"
            >

                <option value="portrait">
                    Portrait
                </option>

                <option value="landscape">
                    Landscape
                </option>

            </select>


            <br><br>


            <label>Image Fit</label>

            <select id="imageFit">

                <option value="contain">
                    Fit Inside Page
                </option>

                <option value="cover">
                    Fill Page
                </option>

                <option value="stretch">
                    Stretch
                </option>

            </select>


            <br><br>


            <button onclick="createJpgPdf()">
                Create PDF
            </button>


            <div class="result" id="pdfResult">
                Select images.
            </div>
            `
        );

        return;
    }



    if (type === "pdfToJpg") {

        openWorkspace(

            "📄 PDF → JPG",

            `
            <input
                type="file"
                id="pdfJpgFile"
                accept=".pdf"
            >


            <div class="row">

                <div class="field">

                    <label>Width</label>

                    <input
                        type="number"
                        id="pdfJpgWidth"
                        value="1200"
                    >

                </div>


                <div class="field">

                    <label>Height</label>

                    <input
                        type="number"
                        id="pdfJpgHeight"
                        value="1600"
                    >

                </div>

            </div>


            <label>Quality</label>

            <input
                type="range"
                id="pdfJpgQuality"
                min="10"
                max="100"
                value="90"
            >


            <br><br>


            <label>Page</label>

            <input
                type="number"
                id="pdfPage"
                min="1"
                value="1"
            >


            <br><br>


            <button onclick="convertPdfToJpg()">
                Convert PDF
            </button>


            <div class="result" id="pdfJpgResult">
                Select PDF.
            </div>
            `
        );

        return;
    }



    if (type === "merge") {

        openWorkspace(

            "📑 Merge PDF",

            `
            <input
                type="file"
                id="mergeFiles"
                accept=".pdf"
                multiple
            >

            <br><br>

            <button onclick="mergePDF()">
                Merge PDFs
            </button>

            <div class="result" id="mergeResult"></div>
            `
        );

        return;
    }



    if (type === "split") {

        openWorkspace(

            "✂️ Split PDF",

            `
            <input
                type="file"
                id="splitFile"
                accept=".pdf"
            >

            <br><br>


            <div class="row">

                <div class="field">

                    <label>Start Page</label>

                    <input
                        type="number"
                        id="startPage"
                        min="1"
                        value="1"
                    >

                </div>


                <div class="field">

                    <label>End Page</label>

                    <input
                        type="number"
                        id="endPage"
                        min="1"
                        value="1"
                    >

                </div>

            </div>


            <button onclick="splitPDF()">
                Split PDF
            </button>


            <div class="result" id="splitResult"></div>
            `
        );

        return;
    }



    if (type === "compress") {

        openWorkspace(

            "🗜️ Compress PDF",

            `
            <input
                type="file"
                id="compressFile"
                accept=".pdf"
            >

            <br><br>


            <label>Compression Level</label>

            <select id="compressionLevel">

                <option value="low">
                    Low - Better Quality
                </option>

                <option value="medium" selected>
                    Medium
                </option>

                <option value="high">
                    High - Smaller File
                </option>

            </select>


            <br><br>


            <button onclick="compressPDF()">
                Compress PDF
            </button>


            <div class="result" id="compressResult"></div>
            `
        );
    }
}


/* =========================================
   JPG → PDF
========================================= */

async function createJpgPdf() {

    const files =
        document.getElementById("jpgFiles").files;


    if (!files.length) {

        alert("Select images.");

        return;
    }


    const width =
        Number(document.getElementById("pageWidth").value);

    const height =
        Number(document.getElementById("pageHeight").value);


    const fit =
        document.getElementById("imageFit").value;


    const pdfDoc =
        await PDFLib.PDFDocument.create();


    for (const file of files) {

        const bytes =
            await file.arrayBuffer();


        let image;


        if (file.type === "image/png") {

            image =
                await pdfDoc.embedPng(bytes);

        } else {

            image =
                await pdfDoc.embedJpg(bytes);
        }


        const page =
            pdfDoc.addPage([width, height]);


        const imgWidth =
            image.width;

        const imgHeight =
            image.height;


        let drawWidth = width;

        let drawHeight = height;

        let x = 0;

        let y = 0;


        if (fit === "contain") {

            const scale =
                Math.min(
                    width / imgWidth,
                    height / imgHeight
                );


            drawWidth =
                imgWidth * scale;

            drawHeight =
                imgHeight * scale;


            x =
                (width - drawWidth) / 2;

            y =
                (height - drawHeight) / 2;
        }


        if (fit === "cover") {

            const scale =
                Math.max(
                    width / imgWidth,
                    height / imgHeight
                );


            drawWidth =
                imgWidth * scale;

            drawHeight =
                imgHeight * scale;


            x =
                (width - drawWidth) / 2;

            y =
                (height - drawHeight) / 2;
        }


        page.drawImage(image, {
            x,
            y,
            width: drawWidth,
            height: drawHeight
        });
    }


    const pdfBytes =
        await pdfDoc.save();


    downloadBlob(
        pdfBytes,
        "filetools-images.pdf",
        "application/pdf"
    );


    document.getElementById("pdfResult").innerHTML =
        "✅ PDF created successfully.";
}


/* =========================================
   PDF ORIENTATION
========================================= */

function pdfOrientation() {

    const orientation =
        document.getElementById("orientation").value;


    if (orientation === "landscape") {

        document.getElementById("pageWidth").value = 842;

        document.getElementById("pageHeight").value = 595;

    } else {

        document.getElementById("pageWidth").value = 595;

        document.getElementById("pageHeight").value = 842;
    }
}


/* =========================================
   PDF → JPG
========================================= */

async function convertPdfToJpg() {

    const file =
        document.getElementById("pdfJpgFile").files[0];


    if (!file) {

        alert("Select PDF.");

        return;
    }


    const pageNumber =
        Number(document.getElementById("pdfPage").value);


    const width =
        Number(document.getElementById("pdfJpgWidth").value);


    const height =
        Number(document.getElementById("pdfJpgHeight").value);


    const quality =
        Number(document.getElementById("pdfJpgQuality").value) / 100;


    const data =
        await file.arrayBuffer();


    const pdf =
        await pdfjsLib.getDocument({
            data
        }).promise;


    if (
        pageNumber < 1 ||
        pageNumber > pdf.numPages
    ) {

        alert("Invalid page number.");

        return;
    }


    const page =
        await pdf.getPage(pageNumber);


    const originalViewport =
        page.getViewport({
            scale: 1
        });


    const scale =
        Math.min(
            width / originalViewport.width,
            height / originalViewport.height
        );


    const viewport =
        page.getViewport({
            scale
        });


    const canvas =
        document.createElement("canvas");


    canvas.width =
        Math.round(viewport.width);

    canvas.height =
        Math.round(viewport.height);


    const ctx =
        canvas.getContext("2d");


    await page.render({
        canvasContext: ctx,
        viewport
    }).promise;


    canvas.toBlob(

        function(blob) {

            downloadBlob(
                blob,
                `filetools-page-${pageNumber}.jpg`,
                "image/jpeg"
            );


            document.getElementById(
                "pdfJpgResult"
            ).innerHTML =
                "✅ PDF page converted successfully.";
        },

        "image/jpeg",

        quality
    );
}


/* =========================================
   MERGE PDF
========================================= */

async function mergePDF() {

    const files =
        document.getElementById("mergeFiles").files;


    if (files.length < 2) {

        alert("Select at least 2 PDF files.");

        return;
    }


    const output =
        await PDFLib.PDFDocument.create();


    for (const file of files) {

        const bytes =
            await file.arrayBuffer();


        const source =
            await PDFLib.PDFDocument.load(bytes);


        const pages =
            await output.copyPages(
                source,
                source.getPageIndices()
            );


        pages.forEach(page => {

            output.addPage(page);

        });
    }


    const pdfBytes =
        await output.save();


    downloadBlob(
        pdfBytes,
        "filetools-merged.pdf",
        "application/pdf"
    );


    document.getElementById("mergeResult").innerHTML =
        "✅ PDFs merged successfully.";
}


/* =========================================
   SPLIT PDF
========================================= */

async function splitPDF() {

    const file =
        document.getElementById("splitFile").files[0];


    if (!file) {

        alert("Select PDF.");

        return;
    }


    const start =
        Number(document.getElementById("startPage").value);


    const end =
        Number(document.getElementById("endPage").value);


    const bytes =
        await file.arrayBuffer();


    const source =
        await PDFLib.PDFDocument.load(bytes);


    const total =
        source.getPageCount();


    if (
        start < 1 ||
        end > total ||
        start > end
    ) {

        alert(
            `PDF has ${total} pages. Enter valid range.`
        );

        return;
    }


    const output =
        await PDFLib.PDFDocument.create();


    const indexes = [];


    for (
        let i = start - 1;
        i <= end - 1;
        i++
    ) {

        indexes.push(i);
    }


    const pages =
        await output.copyPages(
            source,
            indexes
        );


    pages.forEach(page => {

        output.addPage(page);

    });


    const pdfBytes =
        await output.save();


    downloadBlob(
        pdfBytes,
        `filetools-pages-${start}-${end}.pdf`,
        "application/pdf"
    );


    document.getElementById("splitResult").innerHTML =
        "✅ PDF split successfully.";
}


/* =========================================
   COMPRESS PDF
========================================= */

async function compressPDF() {

    const file =
        document.getElementById("compressFile").files[0];


    if (!file) {

        alert("Select PDF.");

        return;
    }


    const bytes =
        await file.arrayBuffer();


    const pdf =
        await PDFLib.PDFDocument.load(bytes);


    const level =
        document.getElementById("compressionLevel").value;


    let useObjectStreams = true;


    if (level === "low") {
        useObjectStreams = false;
    }


    const output =
        await pdf.save({
            useObjectStreams
        });


    downloadBlob(
        output,
        "filetools-compressed.pdf",
        "application/pdf"
    );


    document.getElementById("compressResult").innerHTML = `

        ✅ PDF processed.

        <br><br>

        Original:
        ${(file.size / 1024).toFixed(2)} KB

        <br>

        New:
        ${(output.length / 1024).toFixed(2)} KB
    `;
}


/* =========================================
   DOC TOOLS
========================================= */

function docTool(type) {


    if (type === "docxPdf") {

        openWorkspace(

            "📝 DOCX → PDF",

            `
            <input
                type="file"
                id="docxPdfFile"
                accept=".docx"
            >

            <br><br>


            <div class="row">

                <div class="field">

                    <label>Page Width</label>

                    <input
                        id="docPdfWidth"
                        type="number"
                        value="595"
                    >

                </div>


                <div class="field">

                    <label>Page Height</label>

                    <input
                        id="docPdfHeight"
                        type="number"
                        value="842"
                    >

                </div>

            </div>


            <label>Font Size</label>

            <input
                id="docFontSize"
                type="number"
                value="12"
            >


            <br><br>


            <button onclick="docxToPdf()">
                Convert to PDF
            </button>


            <div class="result" id="docResult"></div>
            `
        );

        return;
    }



    if (type === "docxTxt") {

        openWorkspace(

            "📃 DOCX → TXT",

            `
            <input
                type="file"
                id="docxTxtFile"
                accept=".docx"
            >

            <br><br>

            <button onclick="docxToTxt()">
                Convert to TXT
            </button>

            <div class="result" id="docResult"></div>
            `
        );

        return;
    }



    if (type === "txtDocx") {

        openWorkspace(

            "📝 TXT → DOCX",

            `
            <input
                type="file"
                id="txtDocxFile"
                accept=".txt"
            >

            <br><br>


            <label>Font Size</label>

            <input
                type="number"
                id="txtFontSize"
                value="16"
            >


            <br><br>


            <button onclick="txtToDocx()">
                Create DOCX
            </button>


            <div class="result" id="docResult"></div>
            `
        );

        return;
    }



    if (type === "pdfDocx") {

        openWorkspace(

            "📄 PDF → DOCX",

            `
            <input
                type="file"
                id="pdfDocxFile"
                accept=".pdf"
            >

            <br><br>


            <label>Page Width</label>

            <input
                type="number"
                id="pdfDocxWidth"
                value="595"
            >


            <br><br>


            <label>Page Height</label>

            <input
                type="number"
                id="pdfDocxHeight"
                value="842"
            >


            <br><br>


            <button onclick="pdfToDocx()">
                Convert to DOCX
            </button>


            <div class="result" id="docResult"></div>
            `
        );
    }
}


/* =========================================
   DOCX → TXT
========================================= */

async function docxToTxt() {

    const file =
        document.getElementById("docxTxtFile").files[0];


    if (!file) {

        alert("Select DOCX.");

        return;
    }


    const arrayBuffer =
        await file.arrayBuffer();


    const result =
        await mammoth.extractRawText({
            arrayBuffer
        });


    const blob =
        new Blob(
            [result.value],
            {
                type: "text/plain"
            }
        );


    downloadBlob(
        blob,
        "filetools-document.txt",
        "text/plain"
    );


    document.getElementById("docResult").innerHTML =
        "✅ DOCX converted to TXT.";
}


/* =========================================
   DOCX → PDF
========================================= */

async function docxToPdf() {

    const file =
        document.getElementById("docxPdfFile").files[0];


    if (!file) {

        alert("Select DOCX.");

        return;
    }


    const buffer =
        await file.arrayBuffer();


    const result =
        await mammoth.extractRawText({
            arrayBuffer: buffer
        });


    const text =
        result.value || "";


    const width =
        Number(
            document.getElementById("docPdfWidth").value
        );


    const height =
        Number(
            document.getElementById("docPdfHeight").value
        );


    const fontSize =
        Number(
            document.getElementById("docFontSize").value
        );


    const pdf =
        await PDFLib.PDFDocument.create();


    const font =
        await pdf.embedFont(
            PDFLib.StandardFonts.Helvetica
        );


    const lines =
        text.split("\n");


    let page =
        pdf.addPage([
            width,
            height
        ]);


    let y =
        height - 50;


    for (const line of lines) {

        const words =
            line.split(" ");


        let currentLine = "";


        for (const word of words) {

            const test =
                currentLine
                ? currentLine + " " + word
                : word;


            const testWidth =
                font.widthOfTextAtSize(
                    test,
                    fontSize
                );


            if (
                testWidth >
                width - 80
            ) {

                page.drawText(
                    currentLine,
                    {
                        x: 40,
                        y,
                        size: fontSize,
                        font
                    }
                );


                y -=
                    fontSize + 8;


                currentLine =
                    word;


            } else {

                currentLine =
                    test;
            }


            if (y < 50) {

                page =
                    pdf.addPage([
                        width,
                        height
                    ]);


                y =
                    height - 50;
            }
        }


        page.drawText(
            currentLine,
            {
                x: 40,
                y,
                size: fontSize,
                font
            }
        );


        y -=
            fontSize + 10;


        if (y < 50) {

            page =
                pdf.addPage([
                    width,
                    height
                ]);


            y =
                height - 50;
        }
    }


    const bytes =
        await pdf.save();


    downloadBlob(
        bytes,
        "filetools-document.pdf",
        "application/pdf"
    );


    document.getElementById("docResult").innerHTML =
        "✅ DOCX converted to PDF.";
}


/* =========================================
   TXT → DOCX
========================================= */

async function txtToDocx() {

    const file =
        document.getElementById("txtDocxFile").files[0];


    if (!file) {

        alert("Select TXT.");

        return;
    }


    const text =
        await file.text();


    /*
       Browser-only simple DOCX creation
       using Word-compatible HTML.
    */


    const html = `

        <!DOCTYPE html>

        <html>

        <head>

        <meta charset="UTF-8">

        <style>

        body {
            font-family: Arial;
            font-size: 16pt;
        }

        </style>

        </head>

        <body>

        ${escapeHTML(text)
            .replace(/\n/g, "<br>")}

        </body>

        </html>
    `;


    const blob =
        new Blob(
            [html],
            {
                type:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            }
        );


    downloadBlob(
        blob,
        "filetools-document.docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );


    document.getElementById("docResult").innerHTML =
        "✅ DOCX file created.";
}


/* =========================================
   PDF → DOCX
========================================= */

async function pdfToDocx() {

    const file =
        document.getElementById("pdfDocxFile").files[0];


    if (!file) {

        alert("Select PDF.");

        return;
    }


    const data =
        await file.arrayBuffer();


    const pdf =
        await pdfjsLib.getDocument({
            data
        }).promise;


    let allText = "";


    for (
        let i = 1;
        i <= pdf.numPages;
        i++
    ) {

        const page =
            await pdf.getPage(i);


        const content =
            await page.getTextContent();


        const text =
            content.items
                .map(item => item.str)
                .join(" ");


        allText +=
            text + "\n\n";
    }


    const html = `

        <!DOCTYPE html>

        <html>

        <head>

        <meta charset="UTF-8">

        </head>

        <body>

        ${escapeHTML(allText)
            .replace(/\n/g, "<br>")}

        </body>

        </html>
    `;


    const blob =
        new Blob(
            [html],
            {
                type:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            }
        );


    downloadBlob(
        blob,
        "filetools-pdf-document.docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );


    document.getElementById("docResult").innerHTML =
        "✅ PDF text converted to DOCX.";
}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   DOWNLOAD
========================================= */

function downloadBlob(
    data,
    filename,
    type
) {

    const blob =
        data instanceof Blob
        ? data
        : new Blob(
            [data],
            { type }
        );


    const url =
        URL.createObjectURL(blob);


    const a =
        document.createElement("a");


    a.href = url;

    a.download = filename;

    document.body.appendChild(a);

    a.click();

    a.remove();


    setTimeout(
        () => URL.revokeObjectURL(url),
        1000
    );
}