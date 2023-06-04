import * as React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
} from 'react-native';
import AWS from 'aws-sdk';

const sqs = new AWS.SQS({
  apiVersion: '2012-11-05',
  region: 'us-east-2',
  accessKeyId: "AKIAUQF2HVO45VTPAK44",
  secretAccessKey: "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"
});

const queueUrl = 'https://sqs.us-east-2.amazonaws.com/309628218297/Unauth_Users';
// Accept Button              -> https://7qu0h5mlv1.execute-api.us-east-2.amazonaws.com/dev/phone/1/[ImageName] 
// Deny                       -> https://7qu0h5mlv1.execute-api.us-east-2.amazonaws.com/dev/phone/0/[ImageName] 
// Accept and Add User Button -> https://7qu0h5mlv1.execute-api.us-east-2.amazonaws.com/dev/phone/2/[ImageName] 

const HomeScreen = ({ navigation }) => {
  const TIMEOUT = 30;
  const [imageUrl, setImageUrl] = React.useState(null);
  const [hasReceivedImage, setHasReceivedImage] = React.useState(false);
  const [imageName, setImageName] = React.useState(-1);
  const [remainingTime, setRemainingTime] = React.useState(TIMEOUT);

  React.useEffect(() => {
    const timerRenderIntervalid = setInterval(() => {
      setRemainingTime(time => time - 1);
    }, 100);

    const timeoutId = setTimeout(() => {
      handleDenyAccess(); // Call handleDenyAccess() when timeout expires
    }, TIMEOUT);

    const intervalId = setInterval(() => {
      const params = {
        AttributeNames: ['All'],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: ['All'],
        QueueUrl: queueUrl,
        VisibilityTimeout: TIMEOUT,
        WaitTimeSeconds: 20,
      };

      sqs.receiveMessage(params, (err, data) => {
        if (err) {
          console.log('Error receiving message: ', err);
        } else if (data.Messages && data.Messages.length > 0) {
          const message = data.Messages[0];

          console.log(message.Body)

          const messageBody = JSON.parse(message.Body);
          // setImageUrl(`data:image/png;base64,${messageBody.Image}`)
          setImageUrl(`${messageBody.Image}`)
          setImageName(messageBody.ImageName)
          setHasReceivedImage(true);

          var deleteParams = {
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle
          };

          sqs.deleteMessage(deleteParams, (err, data) => {
            if (err) {
              console.log('Error deleting message: ', err);
            } else {
              console.log('Message deleted: ', data);
            }
          });
        }
      });
    }, TIMEOUT * 1000);

    return () => {
      clearInterval(timerRenderIntervalid);
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleAllowPrimary = (err) => {
    const endpointUrl = 'https://7qu0h5mlv1.execute-api.us-east-2.amazonaws.com/dev';
    const path = '/phone/2/' + imageName;
    const body = { x: 5, y: 6 };

    const response = fetch(endpointUrl + path, {
      method: "PUT",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(body), // body data type must match "Content-Type" header
    });
    setHasReceivedImage(false);
    return response;
  };

  const handleAllowOnce = (err) => {
    const endpointUrl = 'https://7qu0h5mlv1.execute-api.us-east-2.amazonaws.com/dev';
    const path = '/phone/1/' + imageName;
    const body = { x: 5, y: 6 };

    const response = fetch(endpointUrl + path, {
      method: "PUT",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(body), // body data type must match "Content-Type" header
    });
    setHasReceivedImage(false);
    return response
  };

  const handleDenyAccess = (err) => {
    const endpointUrl = 'https://7qu0h5mlv1.execute-api.us-east-2.amazonaws.com/dev';
    const path = '/phone/0/' + imageName;
    const body = { x: 5, y: 6 };

    const response = fetch(endpointUrl + path, {
      method: "PUT",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(body), // body data type must match "Content-Type" header
    });
    setHasReceivedImage(false);
    return response
  };

  if (!hasReceivedImage) {
    return (
      <SafeAreaView style={styles.savContainer}>
        <View style={styles.container}>
          <Text style={styles.notActiveText}>No Activity</Text>
        </View>
      </SafeAreaView>
    );
  }
  else {
    return (
      <SafeAreaView style={styles.savContainer}>
        <View style={styles.container}>
          <View style={styles.ImageContainer}>
            <Image style={styles.image} source={{ uri: imageUrl }} />
            <View style={styles.textContainer}>
              <Text style={styles.text}>Remaining time: {remainingTime}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleAllowPrimary}>
            <Text style={[styles.buttonText, styles.button1]}>Allow as Primary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleAllowOnce}>
            <Text style={[styles.buttonText, styles.button2]}>Allow Once</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleDenyAccess}>
            <Text style={[styles.buttonText, styles.button3]}>Deny Access</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    
    top: 10,
    left: 20,
  },
  text: {
    color: 'yellow',
    fontSize: 16,
  },
  //////////////////
  savContainer: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#314D67',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  notActiveText: {
    color: 'gray',
    fontSize: 30
  },
  timeoutContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  timeoutText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

