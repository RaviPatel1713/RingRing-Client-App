import threading
import requests
import string
import json
import pdb

from picamera2 import Picamera2
import RPi.GPIO as GPIO # Import Raspberry Pi GPIO library
from gpiozero import AngularServo
from time import sleep

import boto3
import logging
from botocore.exceptions import ClientError

# Global Variables
picam2 = Picamera2() # Camera module

# https://raspberrypihq.com/use-a-push-button-with-raspberry-pi-gpio/
button_pin = 10
servo_pin = 18

GPIO.setwarnings(False) # Ignore warning for now
GPIO.setmode(GPIO.BOARD) # Use physical pin numbering
GPIO.setmode(GPIO.BOARD) # Use physical pin numbering
GPIO.setup(button_pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN) # Set pin 10 to be an input pin and set initial value to be pulled low (off)
GPIO.setup(servo_pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN) # Set pin 10 to be an input pin and set initial value to be pulled low (off)

button_pin_value = 1
            
def checkChangeValue():
    newValue = GPIO.input(button_pin)
    if newValue == GPIO.HIGH:
        global button_pin_value
        button_pin_value = 0


def receive_messages():
    """
    Receive a batch of messages in a single request from an SQS queue.

    :param queue: The queue from which to receive messages.
    :param max_number: The maximum number of messages to receive. The actual number
                       of messages received might be less.
    :param wait_time: The maximum time to wait (in seconds) before returning. When
                      this number is greater than zero, long polling is used. This
                      can result in reduced costs and fewer false empty responses.
    :return: The list of Message objects received. These each contain the body
             of the message and metadata and custom attributes.
    """
    sqs_client = boto3.client("sqs", 
                                region_name="us-east-2", 
                                aws_access_key_id="AKIAUQF2HVO4URSDEEMR",
                                aws_secret_access_key="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")
    while True:
        response = sqs_client.receive_message(
            QueueUrl = "https://sqs.us-east-2.amazonaws.com/309628218297/Unauth_Users",
            MaxNumberOfMessages = 1,
            VisibilityTimeout=300,
            WaitTimeSeconds = 5,
        )
        
        message = response.get("Messages", [])
        message_body = message["Body"]
        message_rh = message["ReceiptHandle"]
        
        print(f"Message body: {json.loads(message_body)}")
        print(f"Receipt Handle: {message_rh}")
            
        sqs_client.delete_message(
            QueueUrl = "https://sqs.us-east-2.amazonaws.com/309628218297/Unauth_Users",
            ReceiptHandle=msg_ReceiptHandle
        )  
    return message_body



def take_photo():

    global picam2

    #------------- Configuration of the PiCamera
    cam_config = picam2.create_still_configuration() # configuration for high-resolution still image (https://datasheets.raspberrypi.com/camera/picamera2-manual.pdf)
    picam2.configure(cam_config)
    picam2.start() # Init camera
    
    #------------- Capture an image 
    captured_image = picam2.capture_array()
    picam2.capture_file("./dataset/collected_img/demo.jpg")
    picam2.stop()
    print("Done capturing image")

    return captured_image


def main(button_pin_value):
    
    if button_pin_value == 0:
        
        servo = AngularServo(servo_pin, min_pulse_width=0.0006, max_pulse_width=0.0023)
        
        print("Triggering Main pipeline")

        # Function to take a photo using the picar (ideally implemented with a "button")
        img = take_photo()
        img = open("./dataset/collected_img/demo.jpg", "rb")
        
        # Function to send image via the API
        url = 'https://7qu0h5mlv1.execute-api.us-east-2.amazonaws.com/dev/picar/'
        decision_json = requests.put(url=url, data=img)
        decision = decision_json.json()
        if 'message' in decision:
            if decision['message'] == 'Internal server error':
                print('Internal server error')
        else:
            decision = decision["Matched"]
        
        # Decision to open door or not
        if decision == True:
            print("Access granted")
            servo.angle = 90
            sleep(15)
            servo.angle = 0
            sleep(2)
            
        elif decision == False:
            print("Access not granted. Wait for the owner to provide access.")
            message = receive_messages()
            print(message)
                    

def loop():
    global button_pin_value
    checkChangeValue()
    main(button_pin_value)
    button_pin_value = 1

if __name__ == "__main__":    
    while True:
        loop()
    