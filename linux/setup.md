# 한글 입력 uim
export XIM=uim
export XMODIFIERS=@im=uim
export UIM_CANDWIN_PROG=uim-candwin-gtk
export GTK_IM_MODULE=uim
export QT_IM_MODULE=uim

if [ $SHLVL -eq 1 ]; then
  uim-xim &
fi
# uim-pref-gtk

# ll
alias ll='ls -als'
