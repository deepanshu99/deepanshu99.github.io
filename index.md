---
layout: page
title: Archive
---

<ul>
    {%for posts in site.posts%}
        {post.time|date:'%Y'}
        <a href="{{post.url}}">{{post.title}}</a>
    {%endfor%}
</ul>