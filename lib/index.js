const cheerio = require('cheerio')
const fs = require('fs')
const {
  loadJson,
  saveAsJson,
  isEmpty,
} = require('./helpers')

const parseArchive = ({pathHtml, username, fileName, option}) => {
  fs.readFile(pathHtml, 'utf-8', async (err, data) => {
    if(err) {
      console.log(err)
    } else {
      let continues = option.continue
      const $ = cheerio.load(data)
      const tweets = $('.content')
      for(tweet in tweets) {
  
        if (!isNaN(+tweet)) {
          const detail = {}
          tweets[tweet].children.forEach(child => {
  
            //url & date stream-item-header
            if (child.attribs && child.attribs.class == 'stream-item-header') {
              child.children.forEach(c => {
                if (c.name == 'small') {
                  c.children.forEach(ch => {
                    if (ch.name == 'a') {
                        detail.isRetweet = !(new RegExp(username, 'gi').test(ch.attribs.href))
                        detail.url = ch.attribs.href
                        detail.id = ch.attribs.href.split('/').pop()
                        detail.time = ch.attribs.title ? ch.attribs.title : ch.attribs['data-original-title']
                    }
                  })
                }
              })
            }
  
            // reply
            if (child.attribs && child.attribs.class == 'ReplyingToContextBelowAuthor') {
              const replyTo = []
              child.children.forEach(c => {
                if(c.name == 'a') {
                  replyTo.push(c.children[0].children[1].children[0].data)
                }
              })
              detail.replyTo = replyTo
            }
  
            //text js-tweet-text-container
            if (child.attribs && child.attribs.class == 'js-tweet-text-container') {
              child.children.forEach(c => {
                if (c.name == 'p') {
                  const result = []
                  const hashtags = []
                  const mentions = []
                  const tcoLinks = []
                  const expandedLinks = []
                  c.children.forEach(ch => {
                    if (ch.type == 'text') {
                      result.push(ch.data)
                    }
                    if (ch.name == 'img') {
                      result.push(ch.attribs.alt)
                    }
                    if (ch.name == 'a' && ch.attribs.class == 'twitter-hashtag pretty-link js-nav') {
                      const hashtag = []
                      ch.children.forEach(chi => {
                        hashtag.push(chi.children[0].data)
                      })
                      result.push(hashtag.join(''))
                      hashtags.push(hashtag.join(''))
                    }
                    if (ch.name == 'a' && ch.attribs.class == 'twitter-atreply pretty-link js-nav') {
                      const mention = []
                      ch.children.forEach(chi => {
                        mention.push(chi.children[0].data)
                      })
                      result.push(mention.join(''))
                      mentions.push(mention[1])
                    }
                    if (ch.name == 'a' && ch.attribs.class == 'twitter-timeline-link') {
                      tcoLinks.push(ch.attribs.href)
                      expandedLinks.push(ch.attribs.title)
                    }
                  })
                    detail.text = result.join(' ')
                    detail.hashtags = hashtags
                    detail.mentions = mentions
                    detail.links = {
                      tcoLinks: tcoLinks,
                      expandedLinks: expandedLinks,
                    }
                }
              })
            }
  
            //quoted tweet
            if (child.attribs && /QuoteTweet/.test(child.attribs.class)) {
              const quotedTweet = child.children[1].children[1].attribs.href
              const quotedUname = child.children[1].children[3].attribs['data-screen-name']
              let quotedMedia = []
              let quotedHashtags = []
              let quotedMention = []
              let quotedLinks = []
              let text = []
              child.children[1].children[3].children[1].children.forEach(c => {
                if (c.attribs && c.attribs.class == 'QuoteMedia') {
                  c.children[1].children[1].children.forEach(ch => {
  
                    //single
                    if (ch.attribs && ch.attribs.class == 'QuoteMedia-photoContainer js-quote-photo') {
                      quotedMedia.push(ch.attribs['data-image-url'])
                    }
  
                    //double
                    // if (ch.attribs && ch.attribs.class == 'QuoteMedia-quarterPhoto') {
                    //   quotedMedia.push(ch.children[1].attribs['data-image-url'])
                    // }
  
                    //triple / half
                    if (ch.attribs && ch.attribs.class == 'QuoteMedia-halfPhoto') {
                      quotedMedia.push(ch.children[1].attribs['data-image-url'])
                    }
                    if (ch.attribs && ch.attribs.class == 'QuoteMedia-quarterPhotoContainer') {
                      quotedMedia.push(ch.children[1].children[1].attribs['data-image-url'])
                      quotedMedia.push(ch.children[3].children[1].attribs['data-image-url'])
                    }
                    
                    //quad
                    if (ch.attribs && ch.attribs.class == 'QuoteMedia-quarterPhoto') {
                      quotedMedia.push(ch.children[1].attribs['data-image-url'])
                    }
  
  
                  })
                }
                if (c.attribs && c.attribs.class == 'QuoteTweet-authorAndText u-alignTop') {
                  c.children[3].children.forEach(ch => {
                    //hashtag / mention
                    if (ch.name == 'span' && ch.attribs.class == 'twitter-atreply pretty-link js-nav') {
                      if(ch.children[0].children[0].data == '@'){
                        quotedMention.push(ch.children[1].children[0].data)
                      }
                      if(ch.children[0].children[0].data == '#'){
                        quotedHashtags.push(ch.children[1].children[0].data)
                      }
                      text.push(`${ch.children[0].children[0].data}${ch.children[1].children[0].data}`)
                    }
                    //links
                    if (ch.name == 'span' && ch.attribs.class == 'twitter-timeline-link') {
                      quotedLinks.push(ch.attribs.title)
                      ch.children.forEach(chi => {
                        if (chi.attribs.class == 'js-display-url'){
                          text.push(chi.children[0].data)
                        }
                      })
                    }
                    //text
                    if (ch.type == 'text' && !(/…/.test(ch.data))) {
                      text.push(ch.data)
                    }
                  })
                }
              })
              detail.isQuoted = quotedTweet ? true : false
              detail.quoted = {
                quotedText: text.join(''),
                quotedTweet: quotedTweet,
                quotedUname: quotedUname,
                quotedMedia: quotedMedia,
                quotedMention: quotedMention,
                quotedHashtags: quotedHashtags,
                quotedLinks: quotedLinks,
              }
              
            }
  
            //media AdaptiveMediaOuterContainer
            if (child.attribs && child.attribs.class == 'AdaptiveMediaOuterContainer') {
              const medias = []
              child.children.forEach(c => {
                if (c.name == 'div') {
                  c.children.forEach(ch => {
                    if (ch.name == 'div') {
                      ch.children.forEach(chi => {
                        if (chi.name == 'div') {
                          chi.children.forEach(chil => {
                            //video
                            if (chil.name == 'div' && chil.attribs.class == 'AdaptiveMedia-videoContainer') {
                              const style = chil.children[1].children[1].children[1].attribs.style
                              const thumbVideo = new RegExp(/\('(.*?)'\)/gm).exec(style)[1]
                              const isVideo = true
                                detail.thumbVideo = thumbVideo
                                detail.isVideo = isVideo
                            }
  
                            //single
                            if (chil.name == 'div' && chil.attribs.class == 'AdaptiveMedia-photoContainer js-adaptive-photo ') {
                              medias.push(chil.attribs['data-image-url'])
                            }
                            
                            //double
                            if (chil.name == 'div' && chil.attribs.class == 'AdaptiveMedia-halfWidthPhoto') {
                              medias.push(chil.children[1].attribs['data-image-url'])
                            }
  
                            //triple
                            if (chil.name == 'div' && chil.attribs.class == 'AdaptiveMedia-twoThirdsWidthPhoto') {
                              medias.push(chil.children[1].attribs['data-image-url'])
                            }
                            if (chil.name == 'div' && chil.attribs.class == 'AdaptiveMedia-halfHeightPhotoContainer') {
                              medias.push(chil.children[1].children[1].attribs['data-image-url'])
                              medias.push(chil.children[3].children[1].attribs['data-image-url'])
                            }
  
                            //quad
                            if (chil.name == 'div' && chil.attribs.class == 'AdaptiveMedia-threeQuartersWidthPhoto') {
                              medias.push(chil.children[1].attribs['data-image-url'])
                            }
                            if (chil.name == 'div' && chil.attribs.class == 'AdaptiveMedia-thirdHeightPhotoContainer') {
                              medias.push(chil.children[1].children[1].attribs['data-image-url'])
                              medias.push(chil.children[3].children[1].attribs['data-image-url'])
                              medias.push(chil.children[5].children[1].attribs['data-image-url'])
                            }
    
                          })
                        }
                      })
                    }
                  })
                }
              })
              detail.media = medias

            }
            
            //statistics
            if (child.attribs && child.attribs.class == 'stream-item-footer') {
              const statistics = {}
              child.children[1].children.forEach(c => {
                if (c.attribs && c.attribs.class == 'ProfileTweet-action--reply u-hiddenVisually') {
                  statistics.replyCount = +c.children[1].attribs['data-tweet-stat-count']
                }
                if (c.attribs && c.attribs.class == 'ProfileTweet-action--retweet u-hiddenVisually') {
                  statistics.retweetCount = +c.children[1].attribs['data-tweet-stat-count']
                }
                if (c.attribs && c.attribs.class == 'ProfileTweet-action--favorite u-hiddenVisually') {
                  statistics.likeCount = +c.children[1].attribs['data-tweet-stat-count']
                }
              })
              detail.statistics = statistics
            }
  
          })
  
          //save
          if (!isEmpty(detail) && option.save) {
            const load = await loadJson({ fileName })
            if (load.length == 0 || !continues) {
              continues = true
              const result = await saveAsJson({
                fileName,
                content: [{ ...detail }]
              })
            } else {
              const result = await saveAsJson({
                fileName,
                content: [...load, { ...detail }]
              })
            }
          }
          if(!isEmpty(detail)) {
            console.log(tweet)
            console.log(detail)
          }
  
          }
          
      }
      
    }
  })
}

module.exports = parseArchive