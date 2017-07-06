---
layout: page
title: Archive
---
  
<div class="post">
<br>
  <ul>
  {% for post in site.posts %}
  <li>
  <div class="post">
      <h1 class="post-title">
      <a href="{{ post.url }}">
        {{ post.title }}
      </a>
    </h1>
    <span class="post-date">{{ post.date | date_to_string }}</span>
    <h4>{{post.excerpt|truncatewords:50|strip_html}}</h4>
  </div>
  </li>
  {% endfor %}
  </ul>
</div>
