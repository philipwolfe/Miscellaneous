<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/TR/WD-xsl">
  <xsl:template match="/">
    <html>
      <head>
          <title>Transforming xmlelement.xml with XSLT</title>
      </head>

      <body>
        <h1>Transforming xmlelement.xml with XSLT</h1>
        <hr />
        <h2>Book Catalog</h2>
          <table>
        <xsl:apply-templates select="//Book" />
          </table>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="Book">
    <tr>
      <td>
        <b>
          <xsl:value-of select="@Author" />
        </b>
      </td>
      <td>
        <xsl:value-of select="Title" />
      </td>
    </tr>
  </xsl:template>
</xsl:stylesheet> 
