<xsl:stylesheet version="1.0"                 xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="balanceSheet">

<xsl:for-each select="balance">
   <xsl:choose>
      <xsl:when test="@amount[. &lt; 0]">
         <SPAN>
            <xsl:attribute name="style">color:red</xsl:attribute>
            <xsl:value-of select="@amount" />
         </SPAN>
      </xsl:when>
      <xsl:when test="@amount[. > 0]">
         <SPAN>
            <xsl:attribute name="style">color:blue</xsl:attribute>
            <xsl:value-of select="@amount" />
         </SPAN>
      </xsl:when>
      <xsl:otherwise>
         <SPAN>
            <xsl:attribute name="style">color:black</xsl:attribute>
            <xsl:value-of select="@amount" />
         </SPAN>
      </xsl:otherwise>
   </xsl:choose><HR />
</xsl:for-each>

</xsl:template>

</xsl:stylesheet>