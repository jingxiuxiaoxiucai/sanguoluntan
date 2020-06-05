package com.g.l.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller

public class HelloWord {

    @GetMapping("hello")
    public String hello(@RequestParam(name="name") String name , Model model){
    model.addAttribute("name",name);
//        return name+"---diyigehello 向世界呐喊";
        return  "hello";
    }

    @GetMapping("/")
    public String index(){

        return  "index";
    }
}
