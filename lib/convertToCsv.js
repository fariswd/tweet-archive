const {
  loadJson,
  saveAsCsv,
  loadCsv,
} = require('./helpers')

const convertCsv = async ({ fileName }) => {
  try {
    const load = await loadJson({ fileName })
    const head = `id,url,time,is_retweet,is_quoted,is_reply,reply_to,text,hashtag,mention,is_video,video_thumb,video_url,media_count,media,media1,media2,media3,media4,link_quoted,username_quoted,media_quoted,media_quoted1,media_quoted2,media_quoted3,media_quoted4,hashtag_quoted,mention_quoted,links_quoted,text_quoted,reply_count,rt_count,love_count\n`
    
    const tweet = load.slice()

    for(let i = 0; i < tweet.length; i++){
      const id = `${tweet[i].id}`
        , url = tweet[i].url
        , time = tweet[i].time
        , is_retweet = tweet[i].isRetweet
        , is_quoted = tweet[i].isQuoted ? true : false
        , is_reply = tweet[i].replyTo ? true : false
        , reply_to = tweet[i].replyTo ? `"${tweet[i].replyTo.join(',')}"` : ''
        , text = `"${tweet[i].text.replace('"','""')}"`
        , hashtag = tweet[i].hashtags.length > 0 ? `"${tweet[i].hashtags.join(',')}"` : ''
        , mention = tweet[i].mentions.length > 0 ? `"${tweet[i].mentions.join(',')}"` : ''
        , is_video = tweet[i].isVideo ? tweet[i].isVideo : false
        , video_thumb = tweet[i].thumbVideo ? tweet[i].thumbVideo : ''
        , video_url = ''
        , media_count = tweet[i].media ? tweet[i].media.length : ''
        , media = tweet[i].media ? `"${tweet[i].media.join(',')}"` : ''
        , media1 = tweet[i].media && tweet[i].media[0] ? `"${tweet[i].media[0]}"` : ''
        , media2 = tweet[i].media && tweet[i].media[1] ? `"${tweet[i].media[1]}"` : ''
        , media3 = tweet[i].media && tweet[i].media[2] ? `"${tweet[i].media[2]}"` : ''
        , media4 = tweet[i].media && tweet[i].media[3] ? `"${tweet[i].media[3]}"` : ''
        , link_quoted = !!tweet[i].isQuoted ? tweet[i].quoted.quotedTweet : ''
        , username_quoted = !!tweet[i].isQuoted ? tweet[i].quoted.quotedUname : ''
        , media_quoted = !!tweet[i].isQuoted ? `"${tweet[i].quoted.quotedMedia.join(',')}"` : ''
        , media_quoted1 = !!tweet[i].isQuoted && tweet[i].quoted.quotedMedia[0] ? `"${tweet[i].quoted.quotedMedia[0]}"` : ''
        , media_quoted2 = !!tweet[i].isQuoted && tweet[i].quoted.quotedMedia[1] ? `"${tweet[i].quoted.quotedMedia[1]}"` : ''
        , media_quoted3 = !!tweet[i].isQuoted && tweet[i].quoted.quotedMedia[2] ? `"${tweet[i].quoted.quotedMedia[2]}"` : ''
        , media_quoted4 = !!tweet[i].isQuoted && tweet[i].quoted.quotedMedia[3] ? `"${tweet[i].quoted.quotedMedia[3]}"` : ''
        , hashtag_quoted = !!tweet[i].isQuoted ? `"${tweet[i].quoted.quotedHashtags.join(',')}"` : ''
        , mention_quoted = !!tweet[i].isQuoted ? `"${tweet[i].quoted.quotedMention.join(',')}"` : ''
        , links_quoted = !!tweet[i].isQuoted ? `"${tweet[i].quoted.quotedLinks.join(',')}"` : ''
        , text_quoted = !!tweet[i].isQuoted ? `"${tweet[i].quoted.quotedText.replace('"','""')}"` : ''
        , reply_count = tweet[i].statistics.replyCount
        , rt_count = tweet[i].statistics.retweetCount
        , love_count = tweet[i].statistics.likeCount
      
      const body = `${id},${url},${time},${is_retweet},${is_quoted},${is_reply},${reply_to},${text},${hashtag},${mention},${is_video},${video_thumb},${video_url},${media_count},${media},${media1},${media2},${media3},${media4},${link_quoted},${username_quoted},${media_quoted},${media_quoted1},${media_quoted2},${media_quoted3},${media_quoted4},${hashtag_quoted},${mention_quoted},${links_quoted},${text_quoted},${reply_count},${rt_count},${love_count}\n`
      const csv = await loadCsv({ fileName: `${fileName.split('.')[0]}.csv` })
      
      console.log(i)
      console.log(body)

      await saveAsCsv({
        fileName: `${fileName.split('.')[0]}.csv`,
        content: i === 0 ? head + body : csv + body
      })

    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = convertCsv