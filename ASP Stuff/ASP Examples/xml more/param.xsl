<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">


<xsl:param name="sortBy" />

<xsl:template match="/">
   <TITLE>Wrox Catalog</TITLE>
   <H1 ALIGN="CENTER">Some Wrox Internet Books</H1>
   <xsl:apply-templates select="//Book">
      <xsl:sort select="*[name()=$sortBy]" order="ascending" />
   </xsl:apply-templates>
</xsl:template>

<xsl:template match="Book">
   <TABLE WIDTH="80%" CELLPADDING="10">
      <TR><TD WIDTH="80%">
         <TABLE>
            <TR><TD>
               <H2><xsl:value-of select="Title" /></H2>
            </TD></TR>
            <TR><TD>
               <xsl:apply-templates select="Authors" />
            </TD></TR>
            <TR><TD>
               Code: <xsl:value-of select="Code" />
            </TD></TR>
         </TABLE>
      </TD><TD>
         <xsl:apply-templates select="Cover" />
      </TD></TR>
   </TABLE>
   <HR />
</xsl:template>

<xsl:template match="Authors">
   By
   <xsl:for-each select="Author">
      <xsl:choose>
         <xsl:when test="position() = count(parent::*/Author)">
            <B><xsl:value-of select="." /></B>
         </xsl:when>
         <xsl:when test="position() = count(parent::*/Author)-1">
            <B><xsl:value-of select="." /></B> and
         </xsl:when>
         <xsl:otherwise>
            <B><xsl:value-of select="." /></B>,
         </xsl:otherwise>
      </xsl:choose>
   </xsl:for-each><BR /><BR />
</xsl:template>

<xsl:template match="Cover">
   <IMG>
      <xsl:attribute name="SRC">
         <xsl:value-of select="." />
      </xsl:attribute>
      <xsl:attribute name="ALT">Book Cover</xsl:attribute>
   </IMG>
</xsl:template>

</xsl:stylesheet>