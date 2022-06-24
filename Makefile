all :
	mkdir -p dest
	cp -pr includes LICENSE readme.txt footnote-drawer.php dest
	yarn run build
	yarn run scss

clean:
	rm -fr dest
