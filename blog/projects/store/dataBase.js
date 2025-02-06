const TV = [ 
      {
            title : 'LG OLED42C24LA 42" Smart 4K Ultra HD HDR OLED TV with Google Assistant & Amazon Alexa',
            category : "TV",
            price : 1077,
            imgURL : "https://media.currys.biz/i/currysprod/10236028?$l-large$&fmt=auto",
            description : {
                audio_power : "20W" ,
                resolution : "4K Ultra HD 3840 x 2160p",
                screen_size: '42"',
                refresh_rate: "120Hz"
            },
            rating: 4.5
       },
          {
            title : 'PHILIPS 48OLED707/12 48" Smart 4K Ultra HD HDR OLED TV with Google Assistant' ,
            category : "TV",
            price : 999,
            imgURL : "https://media.currys.biz/i/currysprod/10239554?$l-large$&fmt=auto",
            description : {
            audio_power : "70W" ,
                resolution : "4K Ultra HD 3840 x 2160p",
                screen_size: '48"',
                refresh_rate: "120Hz"
           },
           rating: 4.2
       },
       {
           title : 'LG 50UQ81006LB 50" Smart 4K Ultra HD HDR LED TV with Google Assistant & Amazon Alexa - Dark Iron Grey' ,
           category : "TV",
           price : 109,
           imgURL : "https://media.currys.biz/i/currysprod/10237582?$l-large$&fmt=auto",
           description : {
           audio_power : "20W" ,
               resolution : "4K Ultra HD 3840 x 2160p",
               screen_size: '50"',
               refresh_rate: "50Hz"
           },
           rating: 5
       },
       {
        title : 'LOGIK L24HE21 24" HD Ready LED TV' ,
        category : "TV",
        price : 359,
        imgURL : "https://media.currys.biz/i/currysprod/10219628?$l-large$&fmt=auto",
        description : {
        audio_power : "6W" ,
            resolution : "HD Ready 1366 x 768p",
            screen_size: '24"',
            refresh_rate: "60Hz"
        },
        rating: 3.9
        }
     ]

const MOBILES = [
    {
        title : 'DORO 6620 - Black' ,
        category : "Mobile",
        price : 79.99,
        imgURL : "https://media.currys.biz/i/currysprod/10205392?$l-large$&fmt=auto",
        description : {
            battery: "800 mAh" ,
            resolution: "QVGA 320 x 240p",
            screen_size: '2.8"',
            ram: "64 MB",
            touchscreen: "no"
        },
        rating: 3.9
    },
    {
        title : 'OPPO Reno 7 - 128 GB, Cosmic Black' ,
        category : "Mobile",
        price : 249.00,
        imgURL : "https://media.currys.biz/i/currysprod/M10239057_black?$l-large$&fmt=auto",
        description : {
            battery: "4500 mAh" ,
            resolution : "Full HD+ 2400 x 1080p",
            screen_size: '6.43"',
            ram: "8 GB",
            touchscreen: "yes"
        },
        rating: 3.5
    },
    {
        title : 'SAMSUNG Galaxy Z Fold3 5G - 512 GB, Phantom Black' ,
        category : "Mobile",
        price : 1699.00,
        imgURL : "https://media.currys.biz/i/currysprod/10229527?$l-large$&fmt=auto",
        description : {
            battery: "4400 mAh" ,
            resolution : "QXGA+ 1768 x 2208p",
            screen_size: '7.6"',
            ram: "12 GB",
            touchscreen: "yes"
        },
        rating: 4.8
    },
    {
        title : 'SWISSVOICE S24 - White' ,
        category : "Mobile",
        price : 66.49,
        imgURL : "https://media.currys.biz/i/currysprod/10210008?$l-large$&fmt=auto",
        description : {
            battery: "800 mAh" ,
            resolution : "320 x 240p",
            screen_size: '2.4"',
            touchscreen: "no"
        },
        rating: 2
    },
]

const TECH = TV.concat(MOBILES).sort(() => Math.random() - 0.5) 
let user = {
    login: false
}
let USERS = [{
    age: "22",
avatar: "http://t1.gstatic.com/licensed-image?q=tbn:ANd9GcQLfYS6CauqE_GLBgvMQ3OdXLdEbvHc5f8GZ0kz8h4LMMqgocESqOZlXK3sI0idBgyQJ4d7qDk06FTRqMLqiag",
email: "timurmarenic@gmail.com",
fname: "Tymur",
login: true,
money: 1000,
password: "PDDfe233",
sname: "Marenych",
purchases: [],
}]