#!/usr/bin/env python
# Name:
# Student number:
'''
This script scrapes IMDB and outputs a CSV file with highest ranking tv series.
'''
# IF YOU WANT TO TEST YOUR ATTEMPT, RUN THE test-tvscraper.py SCRIPT.
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

def extract_tvseries(dom):
    '''
    Extract a list of highest ranking TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Ranking
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RANKING TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    # create a counter for the current series
    currentseriescounter = 0
    # create variable for list to be output
    outputlist = []

    for series in dom('tr.detailed'):
        # append list to outputlist so it isn't out of range
        outputlist.append([])

        # Title of current series
        seriestitle = series('td.title a')[0].content

        # Rating of current series
        seriesranking = series('.rating-rating .value')[0].content

        # Genre of current series
        seriesgenre = ""
        genrecounter = 0
        tempgenre = ""
        # for the number of genres (normally 2 or 3)
        for numgenres in series('.genre a'):
            # add the genre to the string + a comma and space
            tempgenre += series('.genre a')[genrecounter].content + ", "
            # remove the last two characters in the string: the comma and space
            seriesgenre = tempgenre[:-2]
            genrecounter += 1

        # Actors of current series
        seriesactors = ""
        actorcounter = 0
        tempactor = ""
        # for the number of actors (normally 3)
        for numactors in series('.credit a'):
            # add the actor the the string + a comma and a space
            tempactor += series('.credit a')[actorcounter].content + ", "
            # remove the last two characters in the string: the comma and space
            seriesactors = tempactor[:-2]
            actorcounter += 1

        # Runtime of current series
        tempruntime = series('.runtime')[0].content
        # remove the last 6 characters in the string: " mins."
        seriesruntime = tempruntime[:-6]

        # put the info of the current series in the list
        outputlist[currentseriescounter] =[seriestitle, seriesranking, seriesgenre, seriesactors, seriesruntime]
        
        # update the counter with 1 to start the next series with a new line
        currentseriescounter += 1

    # print outputlist
    return outputlist 

def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest ranking TV-series.
    '''
    writer = csv.writer(f)
    # write header row to csv file
    writer.writerow(['Title', 'Ranking', 'Genre', 'Actors', 'Runtime'])

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK
    currentrow = 0

    # walk through all 50 rows/series
    for numseries in range(50):
        # store list of current series
        currentseries = tvseries[currentrow]
        # write list of current series to the right cells in row, while also encoding the special characters
        writer.writerow([currentseries[0].encode("utf-8"), currentseries[1].encode("utf-8"), currentseries[2].encode("utf-8"), currentseries[3].encode("utf-8"), currentseries[4].encode("utf-8")])
        # make sure to start on the new series in the next loop
        currentrow += 1

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in testing / grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
