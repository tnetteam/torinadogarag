<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" dir="rtl" lang="fa">
      <head>
        <title>Sitemap - گاراژ تخصصی مکانیکی تورنادو</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style type="text/css">
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 13px;
            color: #333;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
          }
          h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          }
          .info {
            background: #e8f4fd;
            border: 1px solid #bee5eb;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 25px;
            text-align: center;
            color: #0c5460;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          }
          th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            text-align: right;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          td {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
            text-align: right;
          }
          tr:hover {
            background-color: #f8f9fa;
            transform: translateY(-1px);
            transition: all 0.3s ease;
          }
          a {
            color: #3498db;
            text-decoration: none;
            font-weight: 500;
          }
          a:hover {
            color: #2980b9;
            text-decoration: underline;
          }
          .priority {
            background: #e74c3c;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
          }
          .changefreq {
            background: #27ae60;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
          }
          .lastmod {
            color: #7f8c8d;
            font-size: 12px;
          }
          .stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            flex-wrap: wrap;
          }
          .stat {
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            text-align: center;
            margin: 5px;
            min-width: 120px;
          }
          .stat-number {
            font-size: 24px;
            font-weight: bold;
            display: block;
          }
          .stat-label {
            font-size: 12px;
            opacity: 0.9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🗺️ نقشه سایت - گاراژ تخصصی مکانیکی تورنادو</h1>
          
          <div class="info">
            <strong>اطلاعات:</strong> این نقشه سایت شامل تمام صفحات موجود در وب‌سایت گاراژ تخصصی مکانیکی تورنادو می‌باشد.
            <br/>
            <strong>تاریخ به‌روزرسانی:</strong> <xsl:value-of select="sitemap:urlset/sitemap:url[1]/sitemap:lastmod"/>
          </div>

          <div class="stats">
            <div class="stat">
              <span class="stat-number"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span>
              <span class="stat-label">تعداد کل صفحات</span>
            </div>
            <div class="stat">
              <span class="stat-number"><xsl:value-of select="count(sitemap:urlset/sitemap:url[sitemap:priority='1.0'])"/></span>
              <span class="stat-label">صفحات اصلی</span>
            </div>
            <div class="stat">
              <span class="stat-number"><xsl:value-of select="count(sitemap:urlset/sitemap:url[sitemap:priority='0.8'])"/></span>
              <span class="stat-label">صفحات مهم</span>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>آدرس صفحه</th>
                <th>اولویت</th>
                <th>فرکانس تغییر</th>
                <th>آخرین تغییر</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <span class="priority">
                      <xsl:value-of select="sitemap:priority"/>
                    </span>
                  </td>
                  <td>
                    <span class="changefreq">
                      <xsl:value-of select="sitemap:changefreq"/>
                    </span>
                  </td>
                  <td class="lastmod">
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
