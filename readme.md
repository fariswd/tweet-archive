# Tweet Archive
Archive tweet from twitter 'saved as html' file.

## yuvi.json
- 15225 tweets collected from 01-10-2013 until 05-15-2019
- 4 parted saved html raw file
- use query ```from``` , ```since``` and ```until``` on search ```from:cindvia_jkt48 since:2012-01-01 until:2014-01-01```

## Use sample?
```
save as html on someone / searched page
save to ./raw_data/<your_file.html>
change ```index.js``` pathToHtml to ./raw_data/<your_file.html>
npm install
npm start
check result.json
```

## Model Data
Tweet Media:
```
{
    "isRetweet": false,
    "url": "https://twitter.com/Cindvia_JKT48/status/1127535684749647872",
    "id": "1127535684749647872",
    "time": "6:27 PM - 12 May 2019",
    "text": "🐰 🐰 🐰 ❤️",
    "hashtags": [],
    "mentions": [],
    "links": {
        "tcoLinks": [],
        "expandedLinks": []
    },
    "media": [
        "https://pbs.twimg.com/media/D6XPrVnUUAAEIE_.jpg"
    ],
    "statistics": {
        "replyCount": 176,
        "retweetCount": 353,
        "likeCount": 2148
    }
}
```
Tweet Quoted:
```
{
    "isRetweet": false,
    "url": "https://twitter.com/Cindvia_JKT48/status/1127536262770876416",
    "id": "1127536262770876416",
    "time": "6:29 PM - 12 May 2019",
    "text": "hehehehehe.  💕",
    "hashtags": [],
    "mentions": [],
    "links": {
        "tcoLinks": [],
        "expandedLinks": []
    },
    "isQuoted": true,
    "quoted": {
        "quotedText": "Anak buah yori. ",
        "quotedTweet": "https://twitter.com/Nadila_JKT48/status/1127478299116965888",
        "quotedUname": "Nadila_JKT48",
        "quotedMedia": [
            "https://pbs.twimg.com/media/D6Wbg-MU0AAuEQb.jpg"
        ],
        "quotedMention": [],
        "quotedHashtags": [],
        "quotedLinks": []
    },
    "statistics": {
        "replyCount": 34,
        "retweetCount": 76,
        "likeCount": 723
    }
}
```

fariswd  
2019  
🐰🐰🐰❤️  
