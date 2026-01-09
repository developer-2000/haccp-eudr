<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            line-height: 1.6;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .email-header {
            background-color: #ffffff;
            padding: 40px 40px 30px;
            text-align: center;
            border-bottom: 1px solid #e5e5e5;
        }
        .logo {
            max-width: 200px;
            height: auto;
            margin-bottom: 20px;
        }
        .email-body {
            padding: 40px;
        }
        .email-title {
            font-size: 28px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0 0 20px;
            text-align: center;
        }
        .email-text {
            font-size: 16px;
            color: #666666;
            margin: 0 0 30px;
            text-align: center;
            line-height: 1.6;
        }
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        .reset-button {
            display: inline-block;
            padding: 14px 40px;
            background-color: #007bff;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            transition: background-color 0.3s ease;
        }
        .reset-button:hover {
            background-color: #0056b3;
        }
        .email-footer {
            padding: 30px 40px;
            background-color: #f9f9f9;
            border-top: 1px solid #e5e5e5;
            text-align: center;
        }
        .footer-text {
            font-size: 14px;
            color: #999999;
            margin: 0 0 10px;
        }
        .footer-link {
            color: #007bff;
            text-decoration: none;
        }
        .alternative-link {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #e5e5e5;
        }
        .alternative-link-text {
            font-size: 14px;
            color: #666666;
            margin: 0 0 10px;
        }
        .alternative-link-url {
            font-size: 12px;
            color: #999999;
            word-break: break-all;
            font-family: monospace;
        }
        @media only screen and (max-width: 600px) {
            .email-body,
            .email-header,
            .email-footer {
                padding: 30px 20px;
            }
            .email-title {
                font-size: 24px;
            }
            .reset-button {
                padding: 12px 30px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1 style="margin: 0; color: #1a1a1a; font-size: 24px;">{{ config('app.name') }}</h1>
        </div>

        <div class="email-body">
            <h2 class="email-title">Reset Your Password</h2>
            <p class="email-text">
                Hello {{ $user->name ?? 'there' }},
            </p>
            <p class="email-text">
                We received a request to reset your password. Click the button below to create a new password.
            </p>

            <div class="button-container">
                <a href="{{ $resetUrl }}" class="reset-button">Reset Password</a>
            </div>

            <div class="alternative-link">
                <p class="alternative-link-text">
                    If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p class="alternative-link-url">{{ $resetUrl }}</p>
            </div>

            <p class="email-text" style="margin-top: 30px; font-size: 14px; color: #999999;">
                This link will expire in 60 minutes. If you didn't request a password reset, please ignore this email.
            </p>
        </div>

        <div class="email-footer">
            <p class="footer-text">
                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
            </p>
            <p class="footer-text">
                If you have any questions, please contact our support team.
            </p>
        </div>
    </div>
</body>
</html>
