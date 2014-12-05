
## REQUEST ISSUE
# curl https://api.github.com/repos/mobivoc/mobivoc/issues >> issues.json

## REQUEST ALL COMMITS (short version, without files)
# curl https://api.github.com/repos/mobivoc/mobivoc/commits?master >> commits.json
# "https://api.github.com/repos/vmg/redcarpet/issues?state=closed"


## GET SINGLE COMMIT  (long version, without files)
# curl https://api.github.com/repos/mobivoc/mobivoc/commits?master >> commits.json


## CREATE ISSUE
# curl -u "np00" -d '{ "title": "test issue", "body": "some body text", "assignee": "someUser"}' https://api.github.com/repos/mobivoc/vocol/issues


## GET FILE
# curl -u "np00" -H 'Accept: application/vnd.github.v3.raw' https://api.github.com/repos/mobivoc/mobivoc/contents/parking.ttl?ref=ee2ebb509aa60c91cf20992a1e5cf94801207920 >> parking.ttl


## PARSE NEW FILE
#rapper -i turtle -o turtle  error_parking.ttl > new_parking.ttl


import json

with open("issues.json") as of:
    data = json.load(of)

for issue in data:
    t = issue['title']
    n = issue['number']
    url = issue['html_url']
    user = issue['user']
    userName = issue['user']['login']
    print "* %s \n %s \n  [`Issue %s <%s>`_]" % (t, userName, n, url)


