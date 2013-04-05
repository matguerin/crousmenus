wget http://crous.parking.einden.com/static/poitiers-resto.xml
cp poitiers-resto.xml poitiers-resto_tmp.xml
sed -i 's/\&gt;/>/g' poitiers-resto_tmp.xml
sed -i 's/\&lt;/</g' poitiers-resto_tmp.xml
sed -i 's/\&amp;/\&/g' poitiers-resto_tmp.xml
sed -i 's/\&quot;/\*/g' poitiers-resto_tmp.xml
rm -f ru.json
java -jar saxon8.jar poitiers-resto_tmp.xml xsl/ru-hall.xsl > ru.json

wget http://crous.parking.einden.com/static/poitiers-menu.xml
cp poitiers-menu.xml poitiers-menu_tmp.xml
sed -i 's/\&gt;/>/g' poitiers-menu_tmp.xml
sed -i 's/\&lt;/</g' poitiers-menu_tmp.xml
sed -i 's/\&amp;/\&/g' poitiers-menu_tmp.xml
sed -i 's/\&quot;/\*/g' poitiers-resto_tmp.xml
rm -f menu.json
java -jar saxon8.jar poitiers-menu_tmp.xml xsl/ru-menu.xsl > menu.json
