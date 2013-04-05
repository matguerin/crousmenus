<?xml version="1.0" encoding="utf-8"?>

<!DOCTYPE xsl:stylesheet [
	<!ENTITY agrave "&#224;">
	<!ENTITY eacute "&#233;">
]>


<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0" xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<xsl:output method="text" encoding="UTF-8" />
	
	<!-- ________customization starts here________ -->
	
	
	<!-- ________customization ends here________ -->
	
	<xsl:variable name="rootNode" select="/root" />
		
	<xsl:template match="/">
      <xsl:apply-templates select="root" />
	</xsl:template>

	<xsl:template match="root">
	{ 
		"campuses": [
			<xsl:for-each-group select="resto" group-by="@zone">
       			<xsl:sort select="current-grouping-key()" data-type="text"/>
				{   "id": "<xsl:value-of select="position()"/>",
					"name": "<xsl:value-of select="current-grouping-key()"/>",
					"diningHalls": [
						<xsl:for-each select="current-group()">
		       			{
							"key": "<xsl:value-of select="@id"/>",
							"name": "<xsl:value-of select="@title"/>",
							"location": "<xsl:value-of select="@lat"/>, <xsl:value-of select="@lon"/>",
							"type": "<xsl:value-of select="@type"/>",
							"openingHours": "<xsl:value-of select="@opening"/>",
							"nextReopeningDate": "<xsl:value-of select="@closing"/>",
							"shortDesc": "<xsl:value-of select="@short_desc"/>",
							"img": "<xsl:value-of select="infos/img[1]/@src"/>",
							"contactInfo": {
								"address": "<xsl:for-each select="contact/p[1]/node()"><xsl:if test="name()='br'"> - </xsl:if><xsl:value-of select="."/></xsl:for-each>",
								"tel": "<xsl:value-of select="contact//a[starts-with(@href, 'tel')][1]"/>",
								"email": "<xsl:value-of select="contact//a[starts-with(@href, 'mailto')][1]"/>"
							},
							"desc": [
								<xsl:for-each select="infos/h2">
									<xsl:variable name="infoId" select="generate-id(.)"/>
									{ "name": "<xsl:value-of select="."/>",
									  "value" :"<xsl:value-of select="following-sibling::node()[(name() = 'p' or self::text()) and generate-id(preceding-sibling::h2[1]) = $infoId]" />"
									}<xsl:if test="position()!=last()">, </xsl:if>
								</xsl:for-each>	
							]
						}<xsl:if test="position()!=last()">, </xsl:if>
			     		</xsl:for-each>
					]
				}<xsl:if test="position()!=last()">, </xsl:if>
	      </xsl:for-each-group>
		]
	}
	</xsl:template>

		
</xsl:stylesheet>