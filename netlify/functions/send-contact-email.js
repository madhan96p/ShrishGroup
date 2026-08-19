const { Resend } = require("resend");

/* =========================================================
   RESEND
   ========================================================= */

const resend = new Resend(process.env.RESEND_API_KEY);

/* =========================================================
   EMAIL CONFIGURATION
   ========================================================= */

const TO_EMAIL = "info@shrishgroup.com";

const CC_EMAILS = [
  "Saravanaperumal0994@gmail.com",
  "pragadsa08@gmail.com",
  "drumsjega5466@gmail.com",
];

/* =========================================================
   HTML ESCAPE
   Prevents HTML injection inside email content.
   ========================================================= */

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================================================
   EMAIL TEMPLATE
   ========================================================= */

function generateEmailBase(title, contentHtml) {
  return `
<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
/>

<title>${escapeHtml(title)}</title>

</head>


<body
style="
margin:0;
padding:0;
background:#f1f5f9;
font-family:
Arial,
Helvetica,
sans-serif;
"
>


<table
width="100%"
cellpadding="0"
cellspacing="0"
border="0"
style="background:#f1f5f9;"
>

<tr>

<td
align="center"
style="padding:30px 15px;"
>


<table
width="620"
cellpadding="0"
cellspacing="0"
border="0"
style="
max-width:620px;
width:100%;
background:#ffffff;
border-radius:18px;
overflow:hidden;
box-shadow:0 10px 35px rgba(15,23,42,.10);
"
>


<!-- HEADER -->

<tr>

<td
style="
background:
linear-gradient(
135deg,
#07111f,
#0f172a
);
padding:28px;
text-align:center;
"
>

<img
src="https://www.shrishgroup.com/assets/images/w-logo.webp"
alt="Shrish Group"
style="
max-width:145px;
height:auto;
display:inline-block;
"
/>

</td>

</tr>


<!-- CONTENT -->

<tr>

<td
style="
padding:35px 30px;
"
>

${contentHtml}

</td>

</tr>


<!-- FOOTER -->

<tr>

<td
style="
background:#f8fafc;
padding:24px 30px;
text-align:center;
font-size:12px;
line-height:1.7;
color:#64748b;
"
>

<strong
style="color:#0f172a;"
>
Shrish Group
</strong>

<br>

info@shrishgroup.com

<br>

© ${new Date().getFullYear()}
Shrish Group. All rights reserved.

</td>

</tr>


</table>

</td>

</tr>

</table>

</body>

</html>
`;
}

/* =========================================================
   NETLIFY FUNCTION
   ========================================================= */

exports.handler = async function (event, context) {
  /* -----------------------------------------------
           CORS
           ----------------------------------------------- */

  const headers = {
    "Access-Control-Allow-Origin": "*",

    "Access-Control-Allow-Headers": "Content-Type",

    "Access-Control-Allow-Methods": "POST, OPTIONS",

    "Content-Type": "application/json",
  };

  /* -----------------------------------------------
           OPTIONS
           ----------------------------------------------- */

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers,
      body: "",
    };
  }

  /* -----------------------------------------------
           METHOD
           ----------------------------------------------- */

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,

      headers,

      body: JSON.stringify({
        success: false,
        message: "Method not allowed.",
      }),
    };
  }

  try {
    /* -------------------------------------------
               PARSE REQUEST
               ------------------------------------------- */

    const data = JSON.parse(event.body || "{}");

    const name = String(data.name || "").trim();

    const email = String(data.email || "").trim();

    const phone = String(data.phone || "").trim();

    const division = String(data.division || "").trim();

    const message = String(data.message || "").trim();

    /* -------------------------------------------
               SERVER-SIDE VALIDATION
               ------------------------------------------- */

    if (
      name.length < 3 ||
      email.length < 5 ||
      phone.length < 10 ||
      !division ||
      message.length < 15
    ) {
      return {
        statusCode: 400,

        headers,

        body: JSON.stringify({
          success: false,

          message: "Please provide valid form details.",
        }),
      };
    }

    /* -------------------------------------------
               EMAIL SUBJECT
               ------------------------------------------- */

    const subject = `New Website Enquiry — ${division} — ${name}`;

    /* -------------------------------------------
               EMAIL CONTENT
               ------------------------------------------- */

    const content = `

<h2
style="
margin:0 0 8px;
font-size:24px;
color:#0f172a;
"
>
New Website Enquiry
</h2>


<p
style="
margin:0 0 28px;
color:#64748b;
font-size:14px;
"
>
A new enquiry has been submitted through
the Shrish Group website.
</p>


<div
style="
background:#f8fafc;
border:1px solid #e2e8f0;
border-radius:12px;
padding:22px;
"
>


<table
width="100%"
cellpadding="0"
cellspacing="0"
border="0"
>


<tr>

<td
style="
padding:8px 0;
color:#64748b;
width:130px;
"
>
<strong>Name</strong>
</td>

<td
style="
padding:8px 0;
color:#0f172a;
"
>
${escapeHtml(name)}
</td>

</tr>


<tr>

<td
style="
padding:8px 0;
color:#64748b;
"
>
<strong>Email</strong>
</td>

<td
style="
padding:8px 0;
"
>

<a
href="mailto:${escapeHtml(email)}"
style="
color:#059669;
text-decoration:none;
"
>
${escapeHtml(email)}
</a>

</td>

</tr>


<tr>

<td
style="
padding:8px 0;
color:#64748b;
"
>
<strong>Phone</strong>
</td>

<td
style="
padding:8px 0;
"
>

<a
href="tel:${escapeHtml(phone)}"
style="
color:#059669;
text-decoration:none;
"
>
${escapeHtml(phone)}
</a>

</td>

</tr>


<tr>

<td
style="
padding:8px 0;
color:#64748b;
"
>
<strong>Division</strong>
</td>

<td
style="
padding:8px 0;
color:#0f172a;
"
>
${escapeHtml(division)}
</td>

</tr>


</table>

</div>


<div
style="
margin-top:22px;
"
>

<h3
style="
margin:0 0 10px;
font-size:16px;
color:#0f172a;
"
>
Message
</h3>


<div
style="
background:#ffffff;
border-left:4px solid #10b981;
padding:16px 18px;
border-radius:8px;
color:#475569;
line-height:1.7;
white-space:pre-wrap;
"
>
${escapeHtml(message)}
</div>

</div>


<div
style="
margin-top:25px;
padding:14px 16px;
background:#ecfdf5;
border:1px solid #a7f3d0;
border-radius:8px;
color:#047857;
font-size:13px;
"
>

<strong>Submitted via:</strong>
Shrish Group Website

</div>

`;

    const htmlBody = generateEmailBase(subject, content);

    /* -------------------------------------------
               SEND THROUGH RESEND
               ------------------------------------------- */

    const result = await resend.emails.send({
      from: "Shrish Group Website <info@shrishgroup.com>",

      to: [TO_EMAIL],

      cc: CC_EMAILS,

      replyTo: email,

      subject: subject,

      html: htmlBody,
    });

    console.log("Contact email sent via Resend:", result);

    /* -------------------------------------------
               SUCCESS
               ------------------------------------------- */

    return {
      statusCode: 200,

      headers,

      body: JSON.stringify({
        success: true,

        message: "Your enquiry has been sent successfully.",
      }),
    };
  } catch (error) {
    console.error("Resend contact email error:", error);

    return {
      statusCode: 500,

      headers,

      body: JSON.stringify({
        success: false,

        message: "Unable to send the enquiry.",
      }),
    };
  }
};
