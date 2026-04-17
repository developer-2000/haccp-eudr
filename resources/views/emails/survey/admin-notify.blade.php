<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ config('app.name') }} — Survey Notification</title>
</head>
<body style="margin:0; padding:0; background:#eef6ff; font-family: Arial, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef6ff; padding:20px;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px;">
                <tr>
                    <td style="background:#1062b9; padding:15px 20px; border-top-left-radius:8px; border-top-right-radius:8px; color:#ffffff; font-size:18px; font-weight:bold;">
                        {{ $eventType === 'created' ? 'Создан ответ' : 'Обновлен ответ' }}
                    </td>
                </tr>
                <tr>
                    <td style="padding:25px 20px;">
                        <table width="100%" cellpadding="6" cellspacing="0" border="0" style="font-size:14px; color:#333;">
                            <tr>
                                <td style="font-weight:bold; width:130px; vertical-align:top;">Email:</td>
                                <td>{{ $respondentEmail }}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; vertical-align:top;">Name:</td>
                                <td>{{ $respondentName }}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; vertical-align:top;">Country:</td>
                                <td>{{ $country }}</td>
                            </tr>
                            <tr>
                                <td style="font-weight:bold; vertical-align:top;">Business type:</td>
                                <td>{{ $businessType }}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:10px 20px 20px; font-size:12px; color:#999;">
                        {{ config('app.name') }} &mdash; {{ now()->format('d.m.Y H:i') }}
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
