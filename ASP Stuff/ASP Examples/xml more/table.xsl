<xsl:stylesheet version="1.0"                 xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
   <TABLE WIDTH="500">
      <xsl:apply-templates select="//item" />
   </TABLE>
</xsl:template>

<xsl:template match="item">
   <TR>
      <xsl:if test="position() mod 2 = 0">
         <xsl:attribute name="bgcolor">lightgrey</xsl:attribute>
      </xsl:if>
      <xsl:value-of select="." />
   </TR>
</xsl:template>


</xsl:stylesheet>