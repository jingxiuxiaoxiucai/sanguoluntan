package com.g.l.provider;


import com.alibaba.fastjson.JSON;
import com.g.l.dto.AccessTokenDto;
import com.g.l.dto.GithubUser;
import okhttp3.*;
import org.springframework.stereotype.Component;

import java.io.IOException;

//用来处理工具类
@Component//将该类初始化加入spring上下文到意思，去掉new
public class GithubProvider {

    //该方法主要获取accestoken
    public  String  getAccessToken(AccessTokenDto accessTokenDto){
        MediaType mediaType=MediaType.get("application/json; charset=utf-8");
        OkHttpClient client=new OkHttpClient();
        RequestBody body= RequestBody.create(mediaType, JSON.toJSONString(accessTokenDto));
        Request request =new Request.Builder()
                .url("https://github.com/login/oauth/access_token")
                .post(body)
                .build();
        try (Response response = client.newCall(request).execute()) {
            String string=response.body().string();
            //拆分数据，拿到需要的access_token
            String accessToken=string.split("&")[0].split("=")[1];
            System.err.println("aceetoken:"+accessToken);
            return accessToken;
            //返回拆分好的access_token的状态吗,一定要注意这个坑搞了一天

        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
    //根据accesntoke解析出用户的所有信息
    public GithubUser getUser(String access_token){
        System.out.println("getUser接受的accesstaken:"+access_token);
        OkHttpClient client=new OkHttpClient();
        Request request =new Request.Builder()
                .url("https://api.github.com/user?access_token="+access_token)
                .build();
        try (Response response = client.newCall(request).execute()) {
            String string=response.body().string();
            //请求的网站带出所有的数据转换为json格式放进对象
            GithubUser user= JSON.parseObject(string, GithubUser.class);
            //将得到的字符串转换为整个GithubUser类的对象
            System.err.println("接受的值："+user.toString());
            return user;//返回用户信息的对象
        } catch (IOException e) {
            e.printStackTrace();
        }

        return  null;

    }


}
