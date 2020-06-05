package com.g.l.provider;

import cn.ucloud.ufile.UfileClient;
import cn.ucloud.ufile.api.object.ObjectConfig;
import cn.ucloud.ufile.auth.ObjectAuthorization;
import cn.ucloud.ufile.auth.UfileObjectLocalAuthorization;
import cn.ucloud.ufile.bean.PutObjectResultBean;
import cn.ucloud.ufile.exception.UfileClientException;
import cn.ucloud.ufile.exception.UfileServerException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.UUID;

@Service
public class UcloudProvider {
    @Value("TOKEN_f2aaf18e-9cfc-4527-9a68-81aba02297ec")
    private  String publicKey;
    @Value("ae7f7bb9-a751-40f1-bef7-cfb02429b7dd")
    private  String privatekey;
    @Value("mashuai")
    private  String backetName;
    @Value("cn-bj")
    private  String region;
    @Value("ufileos.com")
    private  String suffix;
    @Value("518400000")
    private  Integer  expirse;
    //放入自己密钥
    public  String  uploads(InputStream fileStream,String miedType,String fileName){
        //防止同一个用户上传图片重复
        String genrateFileName="";
        String[] filePath = fileName.split("\\.");
        if(filePath.length>1){
            genrateFileName= UUID.randomUUID().toString()+"."+filePath[filePath.length-1];
        }else {
            return  null;//图片有问题.
        }
        try {
            ObjectAuthorization objectAuthorization = new UfileObjectLocalAuthorization(publicKey, privatekey);
            ObjectConfig config = new ObjectConfig(region, suffix);//填上地区，
            PutObjectResultBean response = UfileClient.object(objectAuthorization, config)
                    .putObject(fileStream, miedType)
                    .nameAs(genrateFileName)
                    .toBucket(backetName)

                    .setOnProgressListener((bytesWritten, contentLength) -> {
                    })
                    .execute();
            if(response!=null && response.getRetCode()==0){
                String url= UfileClient.object(objectAuthorization,config)
                        .getDownloadUrlFromPrivateBucket(genrateFileName,backetName,expirse)
                        .createUrl(); //将上传到的文件夹，过期时间设置好
                return url;
            }
        } catch (UfileClientException e) {
            e.printStackTrace();
            return null;
        } catch (UfileServerException e) {
            e.printStackTrace();
            return null;
        }

        return  genrateFileName;//当前图片名字
    }

}
