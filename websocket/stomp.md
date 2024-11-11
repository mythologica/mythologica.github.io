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






