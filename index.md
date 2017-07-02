---
layout: default
title: Home
---
<style>

</style>

Hey you have finally landed to my page.Hello I'm Deepanshu and I like to make stuff. To know more about me [click here]({{site.baseurl}}/contact).

You can see my latest stuff below:

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

    {{ post.excerpt|truncatewords:50|strip_html}}
  </div>
  </li>
  {% endfor %}
  </ul>