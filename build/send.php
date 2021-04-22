<?php
// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

// Переменные, которые отправляет пользователь
$header = $_POST['head'];
$name = $_POST['name'];
$address = $_POST['address'];
$phone = $_POST['tel'] ? $_POST['tel'] : $_POST['phone'];
$message = $_POST['text'];
$image = $_POST['image'];
$price = $_POST['price'];

// Формирование самого письма
$title = $header;
$body = "
<div>
<h2>$header</h2>
<b>Имя:</b> $name<br>
<b>Телефон  :</b> $phone<br><br>";

$body .= $message ? "<b>Сообщение:</b> $message<br>" : '';
$body .= $address ? "<b>Адрес доставки:</b> $address<br>" : '';
$body .= $price ? "<b>Цена:</b> $price<br>" : '';
$body .= "</div>";
$body .= $image ? "<img src=\"$image\">" : '';


// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();
try {
    $mail->isSMTP();
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth   = true;
     $mail->SMTPDebug = 2;
    //$mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

    // Настройки вашей почты
    $mail->Host       = 'smtp.gmail.com'; // SMTP сервера вашей почты
    $mail->Username   = 'im.rusalim.ne@gmail.com'; // Логин на почте
    $mail->Password   = 'Enk-Yrs-NKc-ggU'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->setFrom('im.rusalim.ne@gmail.com', 'Электросамокаты Kugoo Jilong'); // Адрес самой почты и имя отправителя

    // Получатель письма
//    $mail->addAddress('salexandervl@gmail.com');
    $mail->addAddress('mail-spam2012@yandex.ru');

// Отправка сообщения
  $mail->isHTML(true);
  $mail->Subject = $title;
  $mail->Body = $body;

// Проверяем отравленность сообщения
    if ($mail->send()) {
        $result = "success";
    } else {
        $result = "error";
    }

} catch (Exception $e) {
    $result = "error";
    $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}
echo $result;


