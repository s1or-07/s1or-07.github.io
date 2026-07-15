_____________________
## Proximamente

```shell
openssl x509 -inform DER -in cacert.der -out cacert.pem
openssl x509 -in cacert.pem -subject_hash_old | head -1
mv cacert.pem 9a5ba575.0
```
