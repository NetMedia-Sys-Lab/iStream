import requests
import json
import os
import sys

ryu_ip = sys.argv[1]
ryu_port = '8080'
timer = '0'
priority = '100'

file_flows = "{}/flows.json".format(
    os.path.realpath(os.path.dirname(__file__)))

file_meters = "{}/meters.json".format(
    os.path.realpath(os.path.dirname(__file__)))

file_test = '/Users/rhedayati/workspace/GitHub_Repositories/rhedayati/SODA-Stream/Codes/SampleNetworkSimple/flows.json'

url_flow = 'http://{}:{}/stats/flowentry/add'.format(ryu_ip, ryu_port)
url_meter = 'http://{}:{}/stats/meterentry/add'.format(ryu_ip, ryu_port)


def post_flows(filename, url):

    with open(filename, "r") as fp:
        data = json.load(fp)

    #requests_response = requests_session.post(meter_post, data=data)
    # print(requests_response.content)

    for item in data:
        #item_dict = json.loads(item)
        response = requests.post(url, json=item)
        print(response)
        if (response.ok):
            print("------------------------------")
            if "meter_id" in item:
                print(
                    f"REQUEST SENT - switch {item['dpid']} with meters {item['meter_id']}")
            else:
                print(
                    f"REQUEST SENT - switch {item['dpid']} with flows ipvc: {item['match']['ipv4_src']} ipvd: {item['match']['ipv4_dst']}")
        else:
            #print('There is a problem connecting to REST API')
            if "meter_id" in item:
                print(
                    f"REQUEST FAILED - switch {item['dpid']} with meters {item['meter_id']}")
            else:
                print(f"REQUEST FAILED - switch {item['dpid']} with flows")
            # print(response.text)
            exit(1)


post_flows(file_meters, url_meter)
post_flows(file_flows, url_flow)
