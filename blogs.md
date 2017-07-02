---
layout: page
title: All My Blogs
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

    {{ post.excerpt|strip_html|truncatewords: 50 }}
  </div>
  </li>
  {% endfor %}
  </ul>
</div>
