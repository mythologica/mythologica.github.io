STOMP(Streaming Text Oriented Messaging Protocol)와 WebSocket을 이용한 간단한 채팅 프로그램의 예제를 만들어보겠습니다.
이 예제는 STOMP.js를 사용하여 프론트엔드에서 메시지를 보내고 받을 수 있도록 하고, Java의 javax.websocket-api를 사용하여 백엔드에서 WebSocket 서버를 구현합니다.

### 1. Backend: Java WebSocket 서버

#### Maven 의존성 추가
먼저 Maven 프로젝트를 설정하고, `pom.xml`에 필요한 의존성을 추가합니다.

```xml
<dependencies>
    <dependency>
        <groupId>javax.websocket</groupId>
        <artifactId>javax.websocket-api</artifactId>
        <version>1.1</version>
    </dependency>
    <dependency>
        <groupId>org.glassfish</groupId>
        <artifactId>javax.websocket</artifactId>
        <version>1.1</version>
    </dependency>
</dependencies>
```

#### WebSocket 서버 구현
WebSocket 서버를 구현합니다.

```java
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint("/chat")
public class ChatServer {

    private Session session;
    private static Set<ChatServer> chatServers = new CopyOnWriteArraySet<>();

    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
        chatServers.add(this);
        System.out.println("New connection: " + session.getId());
    }

    @OnMessage
    public void onMessage(String message) {
        System.out.println("Received: " + message);
        for (ChatServer chatServer : chatServers) {
            try {
                chatServer.session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @OnClose
    public void onClose(Session session) {
        chatServers.remove(this);
        System.out.println("Connection closed: " + session.getId());
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        throwable.printStackTrace();
    }
}
```

### 2. Frontend: HTML + STOMP.js

#### HTML 파일 생성
간단한 HTML 파일을 생성하여 STOMP.js를 포함하고, WebSocket을 통해 메시지를 송수신하는 기능을 구현합니다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Application</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>
</head>
<body>
    <h1>Chat Application</h1>
    <div id="chat"></div>
    <input type="text" id="message" placeholder="Enter your message">
    <button onclick="sendMessage()">Send</button>

    <script>
        var stompClient = null;

        function connect() {
            var socket = new WebSocket('ws://localhost:8080/chat');
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function (frame) {
                console.log('Connected: ' + frame);
                stompClient.subscribe('/topic/chat', function (message) {
                    displayMessage(message.body);
                });
            });
        }

        function sendMessage() {
            var message = document.getElementById("message").value;
            stompClient.send("/topic/chat", {}, message);
            document.getElementById("message").value = '';
        }

        function displayMessage(message) {
            var chatDiv = document.getElementById("chat");
            chatDiv.innerHTML += '<div>' + message + '</div>';
        }

        window.onload = connect;
    </script>
</body>
</html>
```

### 3. 실행하기
1. Java WebSocket 서버를 실행합니다. (Java EE 서버가 필요할 수 있음)
2. HTML 파일을 브라우저에서 열어 접속합니다.
3. 여러 브라우저 또는 탭에서 페이지를 열고 메시지를 주고받을 수 있습니다.

이 간단한 예제는 기본적인 채팅 기능을 제공하며, 필요에 따라 추가적으로 사용자 관리, 메시지 저장, UI 개선 등을 해볼 수 있습니다.


WebSocket 서버를 실행하기 위한 Java Main 클래스를 추가하겠습니다. javax.websocket-api는 일반적으로 Java EE 환경에서 사용되며, Embedded WebSocket 서버를 구현할 수 있습니다. 자바의 `javax.websocket.server.ServerContainer`를 사용하여 서버를 배포할 수 있습니다.

여기서는 `org.glassfish.tyrus` 라이브러리를 사용해 Embedded WebSocket 서버를 간단히 구현하겠습니다. Maven의 `pom.xml`에 해당 라이브러리를 추가해야 합니다.

### Maven 의존성 추가
`pom.xml`에 Tyrus 의존성을 추가합니다.

```xml
<dependencies>
    <dependency>
        <groupId>javax.websocket</groupId>
        <artifactId>javax.websocket-api</artifactId>
        <version>1.1</version>
    </dependency>
    <dependency>
        <groupId>org.glassfish.tyrus</groupId>
        <artifactId>tyrus-standalone-client</artifactId>
        <version>1.17</version>
    </dependency>
</dependencies>
```

### Main 클래스 구현
이제 WebSocket 서버를 실행하는 메인 클래스를 작성합니다.

```java
import org.glassfish.tyrus.server.Server;

public class ChatServerMain {
    public static void main(String[] args) {
        // WebSocket 서버 설정
        Server server = new Server("localhost", 8080, "/", ChatServer.class);

        try {
            // 서버 시작
            server.start();
            System.out.println("Chat server started on ws://localhost:8080/chat");
            // 사용자 입력 대기 (서버가 계속 실행되도록)
            System.in.read();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 서버 종료
            server.stop();
            System.out.println("Chat server stopped.");
        }
    }
}
```

### 프로젝트 구조
최종적으로 프로젝트 구조는 다음과 같아야 합니다:

```
/YourProject
    ├── src
    │   ├── main
    │   │   ├── java
    │   │   │   ├── ChatServer.java
    │   │   │   └── ChatServerMain.java
    │   │   └── resources
    ├── pom.xml
```

### 실행 방법
1. Maven을 사용하여 프로젝트를 빌드합니다.
2. 메인 클래스를 실행합니다 (`ChatServerMain`).
3. 이제 `http://localhost:8080/chat`에서 WebSocket 서버가 실행 중입니다.
4. 앞서 만든 HTML 파일을 브라우저에서 열면 이제 채팅 기능을 사용할 수 있습니다.

이 설정을 통해 Java WebSocket 채팅 서버를 성공적으로 구축할 수 있습니다. 필요한 경우 추가적인 예외 처리나 기능을 구현하여 개선할 수 있습니다.



WebSocket을 통해 STOMP 프로토콜을 활용하여 특정 토픽에 대한 구독 및 메시지 전송 기능을 구현하기 위해, Java의 WebSocket 서버에서 구독 및 게시 기능을 추가하는 방법에 대해 설명하겠습니다.

이제 우리는 클라이언트가 특정 "토픽"에 메시지를 publish하고 구독할 수 있도록 백엔드 로직을 구성할 것입니다.

### 1. ChatServer.java 수정

각 클라이언트의 구독 정보를 관리하며 메시지 게시가 가능하도록 코드를 업데이트 합니다.

```java
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint("/chat")
public class ChatServer {

    private Session session;
    private static Set<ChatServer> chatServers = new CopyOnWriteArraySet<>();
    private static Map<String, Set<ChatServer>> topicSubscriptions = new HashMap<>();

    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
        chatServers.add(this);
        System.out.println("New connection: " + session.getId());
    }

    @OnMessage
    public void onMessage(String message) {
        // JSON 메시지를 파싱하여 메서드 호출
        handleMessage(message);
    }

    @OnClose
    public void onClose(Session session) {
        chatServers.remove(this);
        unsubscribeFromAllTopics();
        System.out.println("Connection closed: " + session.getId());
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        throwable.printStackTrace();
    }

    private void handleMessage(String message) {
        // 메시지를 JSON으로 파싱
        // 여기서는 단순화를 위해 메시지가 "type" 필드를 기반으로 다를 수 있다고 가정
        // { "type": "SUBSCRIBE", "topic": "/topic/myTopic" }
        // { "type": "SEND", "topic": "/topic/myTopic", "content": "Hello!" }

        try {
            JSONObject json = new JSONObject(message);
            String type = json.getString("type");
            if ("SUBSCRIBE".equalsIgnoreCase(type)) {
                String topic = json.getString("topic");
                subscribeToTopic(topic);
            } else if ("SEND".equalsIgnoreCase(type)) {
                String topic = json.getString("topic");
                String content = json.getString("content");
                sendMessageToTopic(topic, content);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    // 토픽에 구독
    private void subscribeToTopic(String topic) {
        topicSubscriptions.putIfAbsent(topic, new CopyOnWriteArraySet<>());
        topicSubscriptions.get(topic).add(this);
        System.out.println("Subscribed to topic: " + topic);
    }

    // 특정 토픽에 메시지를 발송
    private void sendMessageToTopic(String topic, String message) {
        Set<ChatServer> subscribers = topicSubscriptions.get(topic);
        if (subscribers != null) {
            for (ChatServer subscriber : subscribers) {
                try {
                    if (subscriber.session.isOpen()) {
                        subscriber.session.getBasicRemote().sendText(message);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    // 모든 구독을 취소
    private void unsubscribeFromAllTopics() {
        for (String topic : topicSubscriptions.keySet()) {
            topicSubscriptions.get(topic).remove(this);
        }
    }
}
```

### 2. 클라이언트 측 (HTML + JavaScript)

클라이언트에서 토픽에 구독하고 메시지를 전송할 수 있도록 HTML 파일을 작성합니다. 클라이언트는 STOMP 프로토콜을 따라 JSON 형식의 메시지를 처리해야 합니다.

#### HTML 파일 수정

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Application</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>
</head>
<body>
    <h1>Chat Application</h1>
    <div id="chat"></div>
    <input type="text" id="topic" placeholder="Enter topic">
    <input type="text" id="message" placeholder="Enter your message">
    <button onclick="subscribe()">Subscribe</button>
    <button onclick="sendMessage()">Send</button>

    <script>
        var stompClient = null;

        function connect() {
            var socket = new WebSocket('ws://localhost:8080/chat');
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function (frame) {
                console.log('Connected: ' + frame);
            });
        }

        function subscribe() {
            var topic = document.getElementById("topic").value;
            stompClient.send("/topic/subscribe", {}, JSON.stringify({ "type": "SUBSCRIBE", "topic": topic }));
            stompClient.subscribe(topic, function (message) {
                displayMessage(message.body);
            });
        }

        function sendMessage() {
            var topic = document.getElementById("topic").value;
            var messageContent = document.getElementById("message").value;

            stompClient.send("/topic/send", {}, JSON.stringify({
                "type": "SEND",
                "topic": topic,
                "content": messageContent
            }));
            document.getElementById("message").value = '';
        }

        function displayMessage(message) {
            var chatDiv = document.getElementById("chat");
            chatDiv.innerHTML += '<div>' + message + '</div>';
        }

        window.onload = connect;
    </script>
</body>
</html>
```

### 최종적으로

이제 이 구현을 통해 클라이언트는 특정 토픽에 구독할 수 있으며, 해당 토픽으로 메시지를 보낼 수 있습니다. 각 클라이언트는 각각의 토픽에 대해 구독을 할 수 있으며, 해당 토픽으로 발송된 메시지는 구독한 모든 클라이언트에게 전달됩니다.

### 실행 방법 요약

1. Java WebSocket 서버를 실행 (`ChatServerMain` 클래스).
2. 웹 페이지를 열고, 주제(topic)를 입력한 후 `Subscribe` 버튼을 클릭하여 구독합니다.
3. 메시지를 입력하고 전송하여 해당 주제에 메시지를 보냅니다.
4. 다른 클라이언트 동일한 주제로 구독하여 메시지를 수신할 수 있습니다.

이러한 방식으로 여러 주제를 지원하는 기본적인 채팅 시스템을 완성할 수 있습니다. 필요에 따라 개선할 수 있는 거의 무궁무진한 방안이 있으니 요구 사항에 맞게 확장하십시오.




WebSocket 연결이 끊겼을 때 자동으로 재연결하는 로직을 추가하는 것은 안정적인 채팅 애플리케이션을 만드는 데 매우 중요한 단계입니다. 아래에서는 클라이언트 측에서 재연결 로직을 구현하는 방법을 설명하겠습니다.

### 1. 서버 측 변경

서버 측에서는 특별한 변경이 필요하지 않습니다. 서버는 여전히 WebSocket 요청을 수신하고 처리합니다. 하지만 여전히 정상적인 운영이 이루어지고 있다고 가정할 수 있습니다.

### 2. 클라이언트 측 변경

클라이언트 측에서는 WebSocket 연결이 끊어졌을 때 재연결 시도를 하도록 코드를 추가해야 합니다. 아래는 JavaScript에서 자동으로 재연결을 시도하는 절차입니다.

#### HTML 파일 수정

다음은 HTML과 JavaScript 코드에 재연결 로직을 추가한 예입니다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Application</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>
</head>
<body>
    <h1>Chat Application</h1>
    <div id="chat"></div>
    <input type="text" id="topic" placeholder="Enter topic">
    <input type="text" id="message" placeholder="Enter your message">
    <button onclick="subscribe()">Subscribe</button>
    <button onclick="sendMessage()">Send</button>

    <script>
        var stompClient = null;
        var socket = null;
        var retryInterval = 5000; // 재연결 시도 간격 (밀리초)

        function connect() {
            socket = new WebSocket('ws://localhost:8080/chat');
            stompClient = Stomp.over(socket);

            stompClient.connect({}, function (frame) {
                console.log('Connected: ' + frame);
            }, function (error) {
                console.error('Error connecting: ' + error);
                handleReconnect(); // 에러가 발생할 경우 재연결 시도
            });

            socket.onclose = function() {
                console.warn('Socket closed. Attempting reconnect...');
                handleReconnect(); // 소켓이 닫히면 재연결 시도
            };
        }

        function handleReconnect() {
            setTimeout(function() {
                console.log('Trying to reconnect...');
                connect();
            }, retryInterval);
        }

        function subscribe() {
            var topic = document.getElementById("topic").value;
            stompClient.send("/topic/subscribe", {}, JSON.stringify({ "type": "SUBSCRIBE", "topic": topic }));
            stompClient.subscribe(topic, function (message) {
                displayMessage(message.body);
            });
        }

        function sendMessage() {
            var topic = document.getElementById("topic").value;
            var messageContent = document.getElementById("message").value;

            stompClient.send("/topic/send", {}, JSON.stringify({
                "type": "SEND",
                "topic": topic,
                "content": messageContent
            }));
            document.getElementById("message").value = '';
        }

        function displayMessage(message) {
            var chatDiv = document.getElementById("chat");
            chatDiv.innerHTML += '<div>' + message + '</div>';
        }

        window.onload = connect;
    </script>
</body>
</html>
```

### 설명

1. **connect()**: WebSocket을 새로 생성하고 연결을 시도합니다. STOMP 클라이언트를 통해 연결을 설정합니다.

2. **handleReconnect()**: 연결 끊김이 감지될 경우, 설정된 간격 후에 `connect()`를 호출하여 WebSocket 서버에 재연결을 시도합니다.

3. **socket.onclose**: WebSocket의 `onclose` 이벤트를 사용하여 소켓이 닫히면 재연결을 시도합니다. 

이러한 방식으로 클라이언트 애플리케이션은 WebSocket 연결이 끊어졌을 때 자동으로 재연결을 시도합니다. 재연결 로직이 실패하면 일정 시간 후에 다시 시도하며, 서버에 연결될 때까지 계속 시도합니다. 이로 인해 불안정한 네트워크 환경에서도 사용자가 원활하게 채팅을 이용할 수 있게 됩니다.
