// Copyright (c) 2025 Franz Steinkress
// Licensed under the MIT License - see LICENSE file for details
//

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "insta-visuals/screenshots");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Liste der Bilddateien
const images = [
    "AbstractFactory.png", "Builder.png", "FactoryMethod.png", "Prototype.png", "Singleton.png", "ClassAdapter.png",
    "Bridge.png", "Decorator.png", "Facade.png", "Flyweight.png", "Composite.png", "Proxy.png", "Command.png",
    "Observer.png", "Visitor.png", "Interpreter.png", "Iterator.png", "Memento.png", "TemplateMethod.png",
    "Strategy.png", "Mediator.png", "State.png", "ChainOfResponsibility.png"
];

const titles = [
    "Erzeugungsmuster", "Erzeugungsmuster", "Erzeugungsmuster", "Erzeugungsmuster", 
    "Erzeugungsmuster", "Strukturmuster", "Strukturmuster", "Strukturmuster", "Strukturmuster", 
    "Strukturmuster", "Strukturmuster", "Strukturmuster", "Verhaltensmuster", "Verhaltensmuster", 
    "Verhaltensmuster", "Verhaltensmuster", "Verhaltensmuster", "Verhaltensmuster", "Verhaltensmuster", 
    "Verhaltensmuster", "Verhaltensmuster", "Verhaltensmuster", "Verhaltensmuster"
];

const descriptions = [
    "Klassendiagramm Abstrakte Fabrik", "Klassendiagramm Erbauer", "Klassendiagramm Fabrikmethode", "Klassendiagramm Prototyp", 
    "Klassendiagramm Singleton", "Klassendiagramm Klassenadapter", "Klassendiagramm Brücke", "Klassendiagramm Dekorierer", "Klassendiagramm Fassade", 
    "Klassendiagramm Fliegengewicht", "Klassendiagramm Kompositum", "Klassendiagramm Proxy", "Klassendiagramm Befehl", "Klassendiagramm Beobachter", 
    "Klassendiagramm Besucher", "Klassendiagramm Interpreter", "Klassendiagramm Iterator", "Klassendiagramm Memento", "Klassendiagramm Schablonenmethode", 
    "Klassendiagramm Strategie", "Klassendiagramm Vermittler", "Klassendiagramm Zustand", "Klassendiagramm Zuständigkeitskette"
];

const dominantColors = [
    "#DDE3E1", "#DDE3E1", "#DDE3E1", "#DDE3E1", "#DDE3E1",
    "#F5EBD6", "#F5EBD6", "#F5EBD6", "#F5EBD6", "#F5EBD6", "#F5EBD6", "#F5EBD6", 
    "#D3D8D4", "#D3D8D4", "#D3D8D4", "#D3D8D4", "#D3D8D4", "#D3D8D4", "#D3D8D4", "#D3D8D4", "#D3D8D4", "#D3D8D4", "#D3D8D4"
];

const fontColors = [
    "#2C2C2C", "#2C2C2C", "#2C2C2C", "#2C2C2C", "#2C2C2C",
    "#3B3B3B", "#3B3B3B", "#3B3B3B", "#3B3B3B", "#3B3B3B", "#3B3B3B", "#3B3B3B",
    "#2A2A2A", "#2A2A2A", "#2A2A2A", "#2A2A2A", "#2A2A2A", "#2A2A2A", "#2A2A2A", "#2A2A2A", "#2A2A2A", "#2A2A2A", "#2A2A2A"
];

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({
        width: 1080,
        height: 1920,
        deviceScaleFactor: 1,
    });

    await page.goto("file://" + __dirname + "/insta-visuals/index.html");

    for (let i = 0; i < images.length; i++) {
        const imageName = images[i];
        const titleName = titles[i];
        const descript = descriptions[i];
        const domColor = dominantColors[i];
        const fontColor = fontColors[i];
        console.log("Verarbeite Bild:", imageName, "Index:", i);

        // Dynamisches Setzen des Bildes und Textes
        await page.evaluate((imgSrc, idx, total, titleName, descript, domColor, fontColor) => {
            try {
                // Bildquelle aktualisieren
                const imgElement = document.querySelector("img");
                if (imgElement) {
                    imgElement.src = `./assets/${imgSrc}`;
                }

                // Text für den Button oder Rahmen aktualisieren
                const textElement = document.querySelector("#closeBtn") || document.querySelector(".frame > div:first-child");
                if (textElement) {
                    textElement.textContent = `Bild ${idx + 1} von ${total}`;
                }

                const textLine1 = document.querySelector("#title.line1")
                if (textLine1) {
                    textLine1.textContent = `${titleName}`;
                }

                const textLine2 = document.querySelector("#description.line2")
                if (textLine2) {
                    textLine2.textContent = `${descript}`;
                }

                const overlayBox = document.querySelector("#overlayBox");
                if (overlayBox) {
                    overlayBox.style.backgroundColor = `${domColor}`;
                    overlayBox.style.color = `${fontColor}`;
                    overlayBox.style.outline = `${domColor}`;
                }
            } catch (error) {
                console.error("Fehler in page.evaluate:", error);
            }
        }, imageName, i, images.length, titleName, descript, domColor, fontColor);

        // Warten, bis das Bild vollständig geladen ist
        await page.waitForFunction(() => {
            const img = document.querySelector("img");
            return img && img.complete && img.naturalHeight > 0;
        });

        // Kurze Verzögerung für Stabilität
        await new Promise(resolve => setTimeout(resolve, 300));

        const filename = `img${i + 1}-${imageName}`;
        const filepath = path.join(outputDir, `${filename}.png`);
        await page.screenshot({ path: filepath, omitBackground: false });
        console.log("Screenshot gespeichert:", filename);
    }

    await browser.close();
})();