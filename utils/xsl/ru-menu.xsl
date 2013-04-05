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
		"food": [
			<xsl:for-each-group select="*/menu" group-by="@date">
       			<xsl:sort select="current-grouping-key()" data-type="text"/>
				{   "date": "<xsl:value-of select="current-grouping-key()"/>",
					"menus": [
						<xsl:for-each select="current-group()">
		       			{
							"diningHall": "<xsl:value-of select="../@id"/>",
							"meals": [
								
								<xsl:for-each select="*">
				       				<xsl:for-each select=".[name()='h2']">
				       					
				       					<xsl:variable name="mealId" select="generate-id(.)"/>
										<xsl:if test="count(preceding-sibling::*) > 0">, </xsl:if>
										{
											"name": "<xsl:value-of select="."/>",
											"categories": [
												
												
												<xsl:for-each select="following-sibling::h4[generate-id(preceding-sibling::h2[1]) = $mealId]">
								       			{
													<xsl:for-each select=".">
														"name": "<xsl:value-of select="."/>",
														"dishes": [
															<xsl:for-each select="following-sibling::ul[not(name()='h4')][1]/li">
																	{ "name": "<xsl:value-of select="."/>", 
																	  "nutritionItems": []
																	}<xsl:if test="position()!=last()">, </xsl:if>
															</xsl:for-each>	
									                    ]
									                </xsl:for-each>
									             }<xsl:if test="position()!=last()">, </xsl:if>
												</xsl:for-each>							
											]
										}<xsl:if test="position()!=last()">, </xsl:if>
					                </xsl:for-each>
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