package com.g.l.dto;

import lombok.Data;

@Data
//将授权等了的一些状态写入进去
public class AccessTokenDto {

    private String client_id;
    private String client_secret;
    private String code;
    private String redirect_uri;
    private String state;
}
