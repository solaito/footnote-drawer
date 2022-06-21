all :
	mkdir -p dest
	cp -pr includes LICENSE readme.txt wp-footnotes.php dest
	yarn run build
	yarn run scss

clean:
	rm -fr dest
