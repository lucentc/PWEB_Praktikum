<?php

header('Content-Type: application/json');
    require '../php/config.php';

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

$name    = trim($input['name'] ?? '');
$email   = trim($input['email'] ?? '');
$phone   = trim($input['phone'] ?? '');
$message = trim($input['message'] ?? '');

$errors = [];
if (empty($name))    { $errors['name']    = 'Name is required'; }
if (empty($email))   { $errors['email']   = 'Email is required'; }
if (empty($phone))   { $errors['phone']   = 'Phone is required'; }
if (empty($message)) { $errors['message'] = 'Message is required'; }

if (!empty($errors)) {
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "INSERT INTO form (name, email, phone, message)
         VALUES (:name, :email, :phone, :message)"
    );
    $stmt->execute([
        ':name'    => $name,
        ':email'   => $email,
        ':phone'   => $phone,
        ':message' => $message
    ]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error']);
}