echo "hello"
echo "filename:$0"
echo "last result:$?"
echo "all parameters:$*"
echo "all parameters:$@"
echo "count parameters:$#"
echo "pid:$$"
echo "first para:$1"
echo "second para:$2"

if [ 1 -eq 1 ]; then
  echo 'eq 1=1'
fi