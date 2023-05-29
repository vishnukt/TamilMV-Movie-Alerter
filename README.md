# TamilMV-Movie-Alerter
Get TamilMV - new movie alerts on Telegram with magnet link for direct downloads, save your time from tiresome ads on their website.

***Just a fun project - Using TamilMV or any piracy website is illegal, unethical, and harms the film industry, so I strongly discourage you from using it.***



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`dbUrl` - MongoDB Connection Uri (DB used to save telegram notified movies history, ie to avoid duplicate notifications)

`telegramAPIKey` - Telegram Bot API Key

`telegramChatId` - Telegram Chat Id

`cronJobIntervalInMinutes` - Cron Job Time Interval in minutes (Checks for new movies in regular interval and will be notified to telegram chat) (default - no cron job will be run)


## API Reference

#### List and notify (telegram) all new movies

```http
  GET localhost:3000/tamilmv
```
```Response
{
    "status": "success",
    "statusCode": 200,
    "message": "Operation Successful",
    "data": {
        "tamilMvMovieFinderResponse": {
            "173335": {
                "name": "Evil Dead Rise (2023) English TRUE WEB-DL - [4K ,1080p & 720p - x264 - (DD+5.1 ATMOS - 768Kbps) - 17GB - 2.7GB - 1.1GB & 400MB] - ESub",
                "link": "https://www.tamilmv.com/index.php?/forums/topic/173335-0",
                "magnetLinks": [
                    {
                        "name": "www.TamilMV.com - Evil Dead Rise (2023) English TRUE WEB-DL - 4K HDR10 - 2160p - HEVC - (DD+5.1 ATMOS - 768Kbps & AAC) - 17GB - ESub.mkv.torrent",
                        "url": "magnet:?xt=urn:btih:8933c6c5f65112466f0ef4ee8b3602b860a&dn=www.TamilMV.com%20-%20Evil%20Dead%20Rise%20(2023)%20English%20TRUE%20WEB-DL%20-%204K%20HDR10%20-%202160p%20-%20HEVC%20-%20(DD%2b5.1%20ATMOS%20-%20768Kbps%20%26%20AAC)fannounce&tr=udp%3a%2f%2ftsundere.pw%3a6969%2fannounce&tr=udp%3a%2f%2ftracker2.dler.org%3a80%2fannounce&tr=wss%3a%2f%2ftracker.btorrent.xyz"
                    },
                    {
                        "name": "www.TamilMV.com - Evil Dead Rise (2023) English HQ HDRip - 1080p - x264 - (DD+5.1 ATMOS - 768Kbps & AAC) - 2.6GB - ESub.mkv.torrent",
                        "url": "magnet:?xt=urn:btih:c412609c99a899fe9918251b260aef3f16&dn=www.TamilMV.com%20-%20Evil%20Dead%20Rise%20(2023)%20English%20HQ%20HDRip%20-%201080p%20-%20x264%20-%20(DD%2b5.1%20ATMOS%20-%20768Kbps%20%26%20AAC)fannounce&tr=udp%3a%2f%2ftsundere.pw%3a6969%2fannounce&tr=udp%3a%2f%2ftracker2.dler.org%3a80%2fannounce&tr=wss%3a%2f%2ftracker.btorrent.xyz"
                    },
                    {
                        "name": "www.TamilMV.com - Evil Dead Rise (2023) English HQ HDRip - 720p - x264 - (DD+5.1 - 192Kbps & AAC) - 1GB - ESub.mkv.torrent",
                        "url": "magnet:?xt=urn:btih:e915ec7ab2134283673c1000bee9425c0dc5&dn=www.TamilMV.com%20-%20Evil%20Dead%20Rise%20(2023)%20English%20HQ%20HDRip%20-%20720p%20-%20x264%20-%20(DD%2b5.1%20-%20192Kbps%20%26%20AAC)%3a%2f%2fbt2.archive.org%3a6969%2fannounce&tr=udp%3a%2f%2fbt1.archive.org%3a6969%2fannounce&tr=udp%3a%2f%2fvibe.sleepyinternetfun.xyz%3a1738%2fannounce&tr=udp%3a%2f%2ftsundere.pw%3a6969%2fannounce&tr=udp%3a%2f%2ftracker2.dler.org%3a80%2fannounce&tr=wss%3a%2f%2ftracker.btorrent.xyz"
                    },
                    {
                        "name": "www.TamilMV.com - Evil Dead Rise (2023) English HQ HDRip - 400MB - x264 - AAC - ESub.mkv.torrent",
                        "url": "magnet:?xt=urn:btih:e62db52e4da9ece4998cf382d3f988f025&dn=www.TamilMV.com%20-%20Evil%20Dead%20Rise%20(2023)tr=udp%3a%2f%2fvibe.sleepyinternetfun.xyz%3a1738%2fannounce&tr=udp%3a%2f%2ftsundere.pw%3a6969%2fannounce&tr=udp%3a%2f%2ftracker2.dler.org%3a80%2fannounce&tr=wss%3a%2f%2ftracker.btorrent.xyz"
                    }
                ]
            }
        }
    }
}
```

NB - The above links won't work - just for documentation.

#### tamilMvMovieFinder()

Returns the list of all new movies along with magnetlinks.


## Screenshots

![Telegram Chat Screenshot](https://raw.githubusercontent.com/vishnukt/TamilMV-Movie-Alerter/main/screenshots/Screenshot%20-%20Telegram%20-%20Chat.jpg)

