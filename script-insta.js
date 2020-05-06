const puppeteer = require('puppeteer');
const fs = require('fs');
const cFile = process.argv[2];
// Grobally declare
let uname, pass;
let Instapage, count;

(async () => {
    try {
        // launch browser 
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized", "--disable-notifications"]
        });
        // set the initially page or main page.
        const pages = await browser.pages();
        let page = pages[0];

        await is_login(page);
        await go_PageLinks(page);
        await is_LikePost(page);


    } catch (err) {
        console.log(err)
    }
})()

async function is_login(page) {
    try {

        let contents = await fs.promises.readFile(cFile);
        let credentials = JSON.parse(contents)
        uname = credentials.email;
        pass = credentials.password;
        url = credentials.url;
        Instapage = credentials.page
        count = credentials.count

        await page.goto(url, {
            waitUntil: "networkidle2"
        });
        await page.waitForSelector('input[name=username]', {
            visible: true
        });
        await page.type('input[name=username]', uname, {
            delay: 120
        })
        await page.type('input[type=password]', pass, {
            delay: 120
        })
        //loginbutton
        await Promise.all([page.waitForNavigation({
                waitUntil: "networkidle2"
            }),
            page.click('button[type=submit]')
        ])
        console.log("Login-Completed.")


    } catch (err) {
        console.log(err);
    }
}
async function go_PageLinks(page) {
    try {

        await page.waitForSelector('input.XTCLo.x3qfX', {
            visible: true
        })
        await page.type('input.XTCLo.x3qfX', Instapage, {
            delay: 120
        })
        await page.keyboard.press('Enter')

        await page.waitForSelector('div.fuqBx a', {
            visible: true
        })
        await page.evaluate(() => {
            document.querySelector('div.fuqBx a').click()
        })
        console.log("Post-Page-open-Completed.")
    } catch (err) {
        console.log(err)
    }
}

async function is_LikePost(page) {
    try {

        let idx = 0;
        do {
            await page.waitForSelector('article > div:nth-child(1) img[decoding="auto"]');
            // children selector
            let elements = await page.$$('article > div:nth-child(1) img[decoding="auto"]')
            // saftey
            let posts = elements[idx];
            // like -> selector
            await posts.click({
                delay: 100
            });
        let like= await page.waitForSelector('span.fr66n > button.wpO6b',{visible:true});
        // document.querySelector('span.fr66n > button.wpO6b').click()
        if(like){
            await like.click({delay:100});
        }
        let close=await page.waitForSelector('.Igw0E button.wpO6b',{visible:true})
        await close.click({delay:100})
        //document.querySelector('.Igw0E button.wpO6b').click()
        console.log(` ✔ Liked ${idx + 1} `)
            idx++;
        } while (idx < count)

        console.log("All Completed")

    } catch (err) {
        console.log(err);
    }
}