#!/bin/sh

array=(Moka-Desktop-*)

for dir in $array; do
	echo compressing "$dir"
	zip -r "$dir" "$dir"
done