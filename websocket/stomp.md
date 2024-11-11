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
