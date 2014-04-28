
Future = Npm.require('fibers/future');
fs     = Npm.require('fs');

Meteor.startup(function () {
    // http://translate.google.com/translate_a/t?client=x&sl=en&tl=kr&text=my friends
    var data = Meteor.call('trans','hi all my friends');
});



Meteor.methods({
    trans : function(str){
        var fut3 = new Future();
        HTTP.post('http://translate.google.com/translate_a/t?client=x&sl=en&tl=ko&ie=UTF-8&oe=UTF-8&text='+str, function(a,b){
            fut3.return(b); //b.data.sentences[0].trans);
        });
        return fut3.wait();
    }
    ,
    transFiles : function(){
        //화일목록 가져오기


        //화일읽기
        try{

            var dirList = fs.readdirSync(transConfig.path.source);
            console.log('화일갯수',dirList.length ,dirList);

        }catch(err){
            return {msg:transConfig.path.source + ' 폴더를 확인해보기 '}
        }

        _.each(dirList,function(val,idx){


            var result = [];

            var data = fs.readFileSync(transConfig.path.source + '/' +  val) + ' ';

            var pargArr = (data).split('\n\n');

            var len = pargArr.length;

            _.each(pargArr,function(parg,idx){

                console.log(idx+1,len);

                var arr = parg.split('\n');

                //번호
                result.push(arr[0]);

                //시간
                result.push(arr[1]);

                //합친문장
                var str = (_.last(arr,arr.length-2)).join(' ');

                result.push(str);

                var rtn = Meteor.call('trans',str);

                try{
                    result.push(rtn.data.sentences[0].trans);
                }catch(err){
                    console.log(err,'###',rtn);
                }

                result.push('\n')

            });

            fs.writeFileSync(transConfig.path.target + '/' + val , result.join('\n'));

        });
        return {msg:'성공하였습니다'};
    }
});

transConfig = {

    path : {
         source : '/Users/ppillip/trans/src'
        ,target : '/Users/ppillip/trans/trg'
    }

}