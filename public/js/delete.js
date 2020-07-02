document.getElementById("delete-post").addEventListener("click", (e) => {
  e.preventDefault();
  var target = e.target;
  const id = target.getAttribute("data-id");
  var xhr = new XMLHttpRequest();
  var ans = confirm("Do you want to delele this post?");
  if (ans == true) {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        window.location.href = "/";
      }
    };
    xhr.open("DELETE", `/post/${id}`, true);
    xhr.send(ans);
  }
});

// $(document).ready(function () {
//   $("#delete-post").on("click", function (e) {
//     e.preventDefault();
//     $target = $(e.target);
//     const id = $target.attr("data-id");
//     $.ajax({
//       type: "DELETE",
//       url: "/post/" + id,
//       success: (res) => {
//         alert("Deleting post");
//         window.location.href = "/";
//       },
//       error: (err) => console.log(err),
//     });
//   });
// });
