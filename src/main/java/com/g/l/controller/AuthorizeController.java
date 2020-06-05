package com.g.l.controller;

import com.g.l.dto.AccessTokenDto;
import com.g.l.dto.GithubUser;
import com.g.l.provider.GithubProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.UUID;

@Controller
public class AuthorizeController {
    @Autowired  //
    private GithubProvider githubProvider;
//    @Autowired
//    private UserMapper userMapper;
    //取出来application.properties文件的值
    @Value("${github.client.id}")
    private  String  clienrId;
    @Value("${github.clinet.secret}")
    private  String clinetSercet;
    @Value("${github.redirect.uri}")
    private String redirectUri;



    @GetMapping("/callback")
    public String callback(@RequestParam(name = "code") String code,
                           @RequestParam(name = "state") String state
            , HttpServletRequest request
            , HttpServletResponse response) {
        AccessTokenDto accessTokenDto=new AccessTokenDto();
        accessTokenDto.setClient_id(clienrId);
        accessTokenDto.setClient_secret(clinetSercet);
        accessTokenDto.setCode(code);
        accessTokenDto.setState(state);
        accessTokenDto.setRedirect_uri(redirectUri);

        String  acessonToken=githubProvider.getAccessToken(accessTokenDto);//获取到acessontoken
        GithubUser githubUser=githubProvider.getUser(acessonToken);
        System.err.println(githubUser.toString());
//        if(githubUser!=null){
//            //判断用户是否已经存在
//            Users users=userMapper.checkUser(githubUser.getId());//根据授权登录唯一标识id
//            //System.err.println("登陆的user："+users.toString()+"----"+githubUser.getId());
//            if(users==null){
//                //执行插入
//                Users users1=new Users();
//                String token= UUID.randomUUID().toString();//随机生成的一个码，理论上不重复，可以用于用于的标识
//                System.err.println("用户第一次登录："+githubUser.getId());
//                users1.setAccount_id(String.valueOf(githubUser.getId()));
//                if(githubUser.getName()==null){
//                    users1.setName("匿名");
//                }else {
//                    users1.setName(githubUser.getName());
//                }
//                users1.setGmt_create(System.currentTimeMillis());//创建时间
//                users1.setGmt_modified(users1.getGmt_create());//修改时间
//                users1.setToken(token);//这个是随机给的一个唯一的标识符
//                users1.setAvatarUrl("/img/mashuaitext.jpg");
//                userMapper.insertUser(users1);//插入信息
//                response.addCookie(new Cookie("token",token));//写入cokien
//                return "redirect:/";
//            }
//            //不是第一次登录,直接查找到token
//            response.addCookie(new Cookie("token",users.getToken()));
//
//
//            return "redirect:/";
//        }
        return "redirect:/";//跳会主页
    }
}
